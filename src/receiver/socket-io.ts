import {Message} from '#/core/message'
import {Receiver} from '#/receiver/receiver'
import std from '#std'
import * as check from '#utils/check'
import http from 'http'
import SocketIO from 'socket.io'

export type SocketIOReceiverOptions = {
    port: number
    host: string
    event: string
}

export class SocketIOReceiver extends Receiver {
    io?: SocketIO.Server
    server?: http.Server
    options: SocketIOReceiverOptions

    constructor(options: SocketIOReceiverOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting socket-io server', {options: this.options})

        this.server = http.createServer()

        this.io = new SocketIO.Server(this.server)
        this.io.on('connection', socket => {
            std.log(`socket-io client connected`, {id: socket.id})

            socket.on(this.options.event, (message: Message) => {
                std.log('socket-io server received', {message})
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(message)
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`socket-io server running on "http://${this.options.host}:${this.options.port}"`)
            this.resolveReady()
        })

        this.server.on('error', error => {
            std.log('socket-io server error', {error})
        })
    }

    async stop() {
        std.log('stopping socket-io server')
        await this.stopServer()
        std.log('socket-io stopped')
    }

    private async stopServer() {
        if (check.isUndefined(this.server)) return std.log('socket-io http server not defined')
        const server = this.server
        return new Promise<void>((resolve, reject) => {
            server.close(error => {
                if (check.isDefined(error)) return reject(error)
                return resolve()
            })
        })
    }
}
