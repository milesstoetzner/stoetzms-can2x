import {Target} from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import {Message} from '#core/message'
import std from '#std'
import WebSocket from 'ws'

export type WSTargetOptions = {
    endpoint: string
}

export class WSTarget extends Target {
    target?: WebSocket
    options: WSTargetOptions

    constructor(options: WSTargetOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting websocket target')

        this.target = new WebSocket(this.options.endpoint)

        this.target.on('open', () => {
            std.log(`websocket target connected`)
            this.resolveReady()
            std.log('websocket target started')
        })

        this.target.on('error', error => {
            std.log(`websocket target errored`, {error})
        })

        this.target.on('close', reason => {
            std.log(`websocket target closed`, {reason})
        })
    }

    async send(message: Message) {
        std.log('websocket target sending', {message})
        assert.isDefined(this.target, 'websocket target not started')
        this.target.send(JSON.stringify(message))
        std.log('websocket target sent')
    }

    async stop() {
        // TODO: wait for disconnect
        std.log('stopping websocket target')
        if (check.isDefined(this.target)) this.target.close()
        std.log('websocket target stopped')
    }
}
