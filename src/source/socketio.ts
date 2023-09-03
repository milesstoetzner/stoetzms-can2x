import {Message} from '#core/message'
import {Source} from '#/source/source'
import std from '#std'
import * as check from '#utils/check'
import http from 'http'
import SocketIO from 'socket.io'

export type SocketIOSourceOptions = {
    port: number
    host: string
    event: string
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

            socket.on(this.options.event, (message: Message) => {
                std.log('socketio source received', {message})
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(message)
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`socketio source running on "http://${this.options.host}:${this.options.port}"`)
            this.resolveReady()
        })

        this.server.on('error', error => {
            std.log('socketio source error', {error})
        })
    }

    async stop() {
        std.log('stopping socketio source')
        await this.stopServer()
        std.log('socketio source stopped')
    }

    private async stopServer() {
        if (check.isUndefined(this.server)) return std.log('socketio http server not defined')
        const server = this.server
        return new Promise<void>((resolve, reject) => {
            server.close(error => {
                if (check.isDefined(error)) return reject(error)
                return resolve()
            })
        })
    }
}
