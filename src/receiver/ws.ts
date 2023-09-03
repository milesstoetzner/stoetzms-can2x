import {Receiver} from '#/receiver/receiver'
import {Message} from '#/types'
import std from '#std'
import * as check from '#utils/check'
import http from 'http'
import * as ws from 'ws'

export type WSReceiverOptions = {
    port: number
    host: string
}

export class WSReceiver extends Receiver {
    server?: http.Server
    options: WSReceiverOptions

    constructor(options: WSReceiverOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting websocket server', {options: this.options})
        this.server = http.createServer()

        const wss = new ws.WebSocketServer({
            server: this.server,
        })

        wss.on('connection', ws => {
            std.log('websocket client connected')

            ws.on('error', error => {
                std.log('websocket server error', {error})
            })

            ws.on('message', (message: string) => {
                std.log('websocket server message', {message})
                if (check.isDefined(this.processor)) {
                    this.processor(JSON.parse(message) as Message)
                } else {
                    std.log('no processor defined')
                }
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`websocket server is now running on "ws://${this.options.host}:${this.options.port}"`)
            this.resolveReady()
        })

        this.server.on('error', error => {
            std.log('websocket server error', {error})
        })
    }

    async stop() {
        if (check.isDefined(this.server)) this.server.close()
    }
}
