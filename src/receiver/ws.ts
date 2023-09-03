import {Message} from '#/core/message'
import {Receiver} from '#/receiver/receiver'
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
                std.log('websocket server received', {message})
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(JSON.parse(message) as Message)
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
        std.log('stopping websocket server')
        await this.stopServer()
        std.log('socket-io stopped')
    }

    private async stopServer() {
        if (check.isUndefined(this.server)) return std.log('websocket http server not defined')
        const server = this.server
        return new Promise<void>((resolve, reject) => {
            server.close(error => {
                if (check.isDefined(error)) return reject(error)
                return resolve()
            })
        })
    }
}
