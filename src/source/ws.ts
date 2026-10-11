import Source from '#/source/source'
import Message from '#core/message'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
import {once} from 'events'
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

        // Also receives the errors of the http server
        wss.on('error', error => {
            std.log('websocket source error', {error})
        })

        wss.on('connection', ws => {
            std.log('websocket source connected')

            ws.on('error', error => {
                std.log('websocket source error', {error})
            })

            ws.on(
                'message',
                hae.listener((message: Buffer) => {
                    std.log('websocket source received', {message})
                    if (check.isUndefined(this.processor)) return std.log('no processor defined')
                    this.processor(Message.fromBuffer(message))
                }, 'problem while receiving websocket source message')
            )
        })

        // Rejects if the server emits an error instead, e.g., since the port is in use
        this.server.listen({port: this.options.port, host: this.options.host})
        await once(this.server, 'listening')
        std.log(`websocket source is now running on "ws://${this.options.host}:${this.options.port}"`)
        this.setReady()
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
        std.log('sending websocket source')
        if (!this.options.bidirectional) return std.log('websocket source not bidirectional')

        if (check.isUndefined(this.wss)) return std.log('websocket source not defined')
        for (const client of this.wss.clients) {
            if (client.readyState === WebSocket.OPEN) client.send(message.toString())
        }

        std.log('websocket source sent')
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
