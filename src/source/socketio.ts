import Source from '#/source/source'
import Message, {JSONMessage} from '#core/message'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
import {once} from 'events'
import http from 'http'
import SocketIO from 'socket.io'

export type SocketIOSourceOptions = {
    port: number
    host: string
    event: string
    bidirectional: boolean
}

export class SocketIOSource extends Source {
    io?: SocketIO.Server
    server?: http.Server
    options: SocketIOSourceOptions

    constructor(options: SocketIOSourceOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting socketio source', {options: this.options})

        this.server = http.createServer()

        this.io = new SocketIO.Server(this.server)
        this.io.on('connection', socket => {
            std.log(`socketio source connected`, {id: socket.id})

            socket.on(
                this.options.event,
                hae.listener((message: JSONMessage, ack?: () => void) => {
                    std.log('socketio source received', {message})
                    if (check.isDefined(ack)) ack()
                    if (check.isUndefined(this.processor)) return std.log('no processor defined')
                    this.processor(Message.fromJSON(message))
                }, 'problem while receiving socketio source message')
            )
        })

        this.server.on('error', error => {
            std.log('socketio source error', {error})
        })

        // Rejects if the server emits an error instead, e.g., since the port is in use
        this.server.listen({port: this.options.port, host: this.options.host})
        await once(this.server, 'listening')
        std.log(`socketio source running on "http://${this.options.host}:${this.options.port}"`)
        this.setReady()
    }

    async send(message: Message) {
        std.log('sending socketio source')
        if (!this.options.bidirectional) return std.log('socketio source not bidirectional')

        if (check.isUndefined(this.io)) return std.log('socketio source not defined')
        this.io.emit(this.options.event, message.toJSON())

        std.log('socketio source sent')
    }

    async stop() {
        std.log('stopping socketio source')
        await hae.try(async () => {
            await this.stopServer()
        }, 'problem when stopping socketio http server')
        std.log('socketio source stopped')
    }

    private async stopServer() {
        if (check.isUndefined(this.server)) return std.log('socketio http server not defined')
        const server = this.server
        return new Promise<void>(resolve => {
            server.close(error => {
                if (check.isDefined(error)) std.log(error)
                return resolve()
            })
        })
    }
}
