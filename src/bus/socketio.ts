import Bus from '#/bus/bus'
import * as check from '#check'
import {JSONMessage} from '#core/message'
import std from '#std'
import http from 'http'
import SocketIO from 'socket.io'

export type SocketIOBusOptions = {
    port: number
    host: string
    event: string
}

export class SocketIOBus extends Bus {
    io?: SocketIO.Server
    server?: http.Server
    options: SocketIOBusOptions

    constructor(options: SocketIOBusOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting socketio bus')

        this.server = http.createServer()

        this.io = new SocketIO.Server(this.server)
        this.io.on('connection', socket => {
            std.log(`socketio client connected`, {id: socket.id})

            socket.on(this.options.event, (message: JSONMessage) => {
                std.log('socketio source received', {message})
                socket.broadcast.emit(this.options.event, message)
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`socketio bus running on "http://${this.options.host}:${this.options.port}"`)
            this.readyPromise.resolve()
        })

        this.server.on('error', error => {
            std.log('socketio bus error', {error})
        })
    }

    async stop() {
        std.log('stopping socketio bus')
        await this.stopServer()
        std.log('socketio bus stopped')
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
