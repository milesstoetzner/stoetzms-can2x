import {Message} from '#/core/message'
import {Target} from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import std from '#std'
import SocketIOClient, {Socket} from 'socket.io-client'

export type SocketIOTargetOptions = {
    endpoint: string
    event: string
}

export class SocketIOTarget extends Target {
    target?: Socket
    options: SocketIOTargetOptions

    constructor(options: SocketIOTargetOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting socketio target')

        this.target = SocketIOClient(this.options.endpoint)

        this.target.on('connect', () => {
            std.log(`socketio target connected`, {id: this.target!.id})
            this.resolveReady()
            std.log('websocket target started')
        })

        this.target.on('connect_error', error => {
            std.log(`socketio target errored`, {error})
        })

        this.target.on('close', reason => {
            std.log(`socketio target closed`, {reason})
        })

        this.target.on('disconnect', reason => {
            std.log(`socketio target disconnected`, {reason})
        })
    }

    async send(message: Message) {
        std.log('socketio target sending', {message})
        assert.isDefined(this.target, 'socketio target not started')
        this.target.emit(this.options.event, message)
        std.log('socketio target sent')
    }

    async stop() {
        // TODO: wait for disconnect
        std.log('stopping socketio target')
        if (check.isDefined(this.target)) this.target.disconnect()
        std.log('socketio target stopped')
    }
}
