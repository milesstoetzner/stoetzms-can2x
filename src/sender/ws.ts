import {Sender} from '#/sender/sender'
import {Message} from '#/types'
import * as assert from '#assert'
import * as check from '#check'
import std from '#std'
import WebSocket from 'ws'

export type WSSenderOptions = {
    endpoint: string
}

export class WSSender extends Sender {
    client?: WebSocket
    options: WSSenderOptions

    constructor(options: WSSenderOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting websocket client')

        this.client = new WebSocket(this.options.endpoint)

        this.client.on('open', () => {
            std.log(`websocket client connected`)
            this.resolveReady()
        })

        this.client.on('error', error => {
            std.log(`websocket client errored`, {error})
        })

        this.client.on('close', reason => {
            std.log(`websocket client closed`, {reason})
        })
    }

    async send(message: Message) {
        assert.isDefined(this.client, 'websocket sender not started')
        this.client.send(JSON.stringify(message))
    }

    async stop() {
        // TODO: wait for disconnect
        std.log('stopping websocket client')
        if (check.isDefined(this.client)) this.client.close()
        std.log('stopped websocket client')
    }
}
