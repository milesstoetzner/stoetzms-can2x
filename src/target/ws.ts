import Target from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import Message from '#core/message'
import std from '#std'
import hae from '#utils/hae'
import WebSocket from 'ws'

const RECONNECT_DELAY = 1000

export type WSTargetOptions = {
    endpoint: string
    bidirectional: boolean
}

export class WSTarget extends Target {
    target?: WebSocket
    options: WSTargetOptions

    private stopped = false
    private reconnectTimer?: NodeJS.Timeout

    constructor(options: WSTargetOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting websocket target')
        this.connect()
    }

    private connect() {
        const target = new WebSocket(this.options.endpoint)
        this.target = target

        target.on('open', () => {
            std.log(`websocket target connected`)
            this.setReady()
            std.log('websocket target started')
        })

        target.on('error', error => {
            std.log(`websocket target errored`, {error})
        })

        target.on('close', code => {
            std.log(`websocket target closed`, {code})
            if (this.stopped) return

            // Connect again, e.g., if the endpoint is not yet available or has been restarted
            std.log(`websocket target reconnecting in ${RECONNECT_DELAY}ms`)
            this.reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY)
        })

        if (this.options.bidirectional) {
            target.on('message', message => {
                std.log('websocket target received', {message})
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(Message.fromArrayBuffer(message))
            })
        }
    }

    async send(message: Message) {
        std.log('websocket target sending', {message})
        assert.isDefined(this.target, 'websocket target not started')

        // Drop instead of queuing, since forwarding stale CAN messages later is worse than losing them
        if (this.target.readyState !== WebSocket.OPEN)
            return std.log('websocket target not connected, dropping message')

        this.target.send(message.toString())
        std.log('websocket target sent')
    }

    async stop() {
        // TODO: wait for disconnect
        std.log('stopping websocket target')
        this.stopped = true
        clearTimeout(this.reconnectTimer)
        await hae.try(async () => {
            if (check.isDefined(this.target)) this.target.close()
        }, 'problem when stopping websocket target')
        std.log('websocket target stopped')
    }
}
