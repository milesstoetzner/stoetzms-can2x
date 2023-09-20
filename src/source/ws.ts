import Source from '#/source/source'
import Message from '#core/message'
import std from '#std'
import * as check from '#utils/check'
import http from 'http'
import WebSocket, * as ws from 'ws'

export type WSSourceOptions = {
    port: number
    host: string
    bidirectional: boolean
}

export class WSSource extends Source {
    server?: http.Server
    options: WSSourceOptions
    ws?: WebSocket

    constructor(options: WSSourceOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting websocket source', {options: this.options})
        this.server = http.createServer()

        const wss = new ws.WebSocketServer({
            server: this.server,
        })

        wss.on('connection', ws => {
            std.log('websocket source connected')

            this.ws = ws

            this.ws.on('error', error => {
                std.log('websocket source error', {error})
            })

            this.ws.on('message', (message: Buffer) => {
                std.log('websocket source received', {message})
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(Message.fromBuffer(message))
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`websocket source is now running on "ws://${this.options.host}:${this.options.port}"`)
            this.readyPromise.resolve()
        })

        this.server.on('error', error => {
            std.log('websocket source error', {error})
        })
    }

    async stop() {
        std.log('stopping websocket source')
        await this.stopServer()
        std.log('websocket source stopped')
    }

    async send(message: Message) {
        std.log('sending can source')
        if (!this.options.bidirectional) return std.log('websocket source not bidirectional')

        if (check.isUndefined(this.ws)) return std.log('websocket source not defined')
        this.ws.send(message.toString())

        std.log('can source sent')
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
