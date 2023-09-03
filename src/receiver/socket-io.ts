import {Receiver} from '#/receiver/receiver'
import {Message} from '#/types'
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
    server?: http.Server
    options: SocketIOReceiverOptions

    constructor(options: SocketIOReceiverOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting socket-io server')

        this.server = http.createServer()

        const io = new SocketIO.Server(this.server)
        io.on('connection', socket => {
            std.log(`socket-io client "${socket.id}" connected`)

            socket.on(this.options.event, (message: Message) => {
                if (check.isDefined(this.processor)) this.processor(message)
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`socket-io server running on "http://${this.options.host}:${this.options.port}"`)
            this.resolveReady()
        })
    }

    async stop() {
        if (check.isDefined(this.server)) this.server.close()
    }
}
