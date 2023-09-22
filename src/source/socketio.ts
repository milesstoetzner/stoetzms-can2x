import Source from '#/source/source'
import Message, {JSONMessage} from '#core/message'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
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
    socket?: SocketIO.Socket

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

            this.socket = socket
            this.socket.on(this.options.event, (message: JSONMessage) => {
                std.log('socketio source received', {message})
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(Message.fromJSON(message))
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`socketio source running on "http://${this.options.host}:${this.options.port}"`)
            this.readyPromise.resolve()
        })

        this.server.on('error', error => {
            std.log('socketio source error', {error})
        })
    }

    async send(message: Message) {
        std.log('sending socketio source')
        if (!this.options.bidirectional) return std.log('socketio source not bidirectional')

        if (check.isUndefined(this.socket)) return std.log('socketio socket not defined')
        this.socket.emit(this.options.event, message.toJSON())

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
