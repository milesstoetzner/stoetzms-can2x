import Target from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import Message from '#core/message'
import std from '#std'
import hae from '#utils/hae'
import WebSocket from 'ws'

export type WSTargetOptions = {
    endpoint: string
    bidirectional: boolean
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
            this.readyPromise.resolve()
            std.log('websocket target started')
        })

        this.target.on('error', error => {
            std.log(`websocket target errored`, {error})
        })

        this.target.on('close', reason => {
            std.log(`websocket target closed`, {reason})
        })

        if (this.options.bidirectional) {
            this.target.on('message', message => {
                std.log('websocket target received', {message})
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(Message.fromArrayBuffer(message))
            })
        }
    }

    async send(message: Message) {
        std.log('websocket target sending', {message})
        assert.isDefined(this.target, 'websocket target not started')
        this.target.send(message.toString())
        std.log('websocket target sent')
    }

    async stop() {
        // TODO: wait for disconnect
        std.log('stopping websocket target')
        await hae.try(async () => {
            if (check.isDefined(this.target)) this.target.close()
        }, 'problem when stopping websocket target')
        std.log('websocket target stopped')
    }
}
