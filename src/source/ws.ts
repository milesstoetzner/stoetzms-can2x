import Source from '#/source/source'
import Message from '#core/message'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
import http from 'http'
import {WebSocket, WebSocketServer} from 'ws'

export type WSSourceOptions = {
    port: number
    host: string
    bidirectional: boolean
}

export class WSSource extends Source {
    server?: http.Server
    wss?: WebSocketServer
    options: WSSourceOptions
    ws?: WebSocket

    constructor(options: WSSourceOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting websocket source', {options: this.options})
        this.server = http.createServer()

        const wss = new WebSocketServer({
            server: this.server,
        })
        this.wss = wss

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
            this.setReady()
        })

        this.server.on('error', error => {
            std.log('websocket source error', {error})
        })
    }

    async stop() {
        std.log('stopping websocket source')
        await hae.try(async () => {
            await this.stopWebSocketServer()
        }, 'problem when stopping websocket server')

        await hae.try(async () => {
            await this.stopServer()
        }, 'problem when stopping websocket http server')
        std.log('websocket source stopped')
    }

    async send(message: Message) {
        std.log('sending can source')
        if (!this.options.bidirectional) return std.log('websocket source not bidirectional')

        if (check.isUndefined(this.ws)) return std.log('websocket source not defined')
        this.ws.send(message.toString())

        std.log('can source sent')
    }

    private async stopWebSocketServer() {
        if (check.isUndefined(this.wss)) return std.log('websocket server not defined')
        const wss = this.wss

        // Otherwise, the http server waits for the open connections forever
        for (const client of wss.clients) client.terminate()

        return new Promise<void>((resolve, reject) => {
            wss.close(error => {
                if (check.isDefined(error)) return reject(error)
                return resolve()
            })
        })
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
