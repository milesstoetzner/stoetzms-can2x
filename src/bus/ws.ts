import Bus from '#/bus/bus'
import * as check from '#check'
import std from '#std'
import hae from '#utils/hae'
import http from 'http'
import {WebSocketServer} from 'ws'

export type WSBusOptions = {
    port: number
    host: string
}

export default class WSBus extends Bus {
    server?: http.Server
    options: WSBusOptions

    constructor(options: WSBusOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting websocket bus', {options: this.options})
        this.server = http.createServer()

        const wss = new WebSocketServer({
            server: this.server,
        })

        wss.on('connection', client => {
            std.log('websocket bus connected')

            client.on('error', error => {
                std.log('websocket bus error', {error})
            })

            client.on('message', (message: Buffer) => {
                std.log('websocket bus received', {message})
                wss.clients.forEach(function each(it) {
                    if (it !== client && it.readyState === WebSocket.OPEN) {
                        it.send(message)
                    }
                })
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`websocket bus is now running on "ws://${this.options.host}:${this.options.port}"`)
            this.setReady()
        })

        this.server.on('error', error => {
            std.log('websocket bus error', {error})
        })
    }

    async stop() {
        std.log('stopping websocket bus')
        await hae.try(async () => {
            await this.stopServer()
        }, 'problem when stopping websocket bus http server')
        std.log('websocket bus stopped')
    }

    private async stopServer() {
        if (check.isUndefined(this.server)) return std.log('websocket bus http server not defined')
        const server = this.server
        return new Promise<void>((resolve, reject) => {
            server.close(error => {
                if (check.isDefined(error)) return reject(error)
                return resolve()
            })
        })
    }
}
