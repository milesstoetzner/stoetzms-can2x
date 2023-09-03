import {Sender} from '#/sender/sender'
import {Message} from '#/types'
import * as assert from '#assert'
import * as check from '#check'
import std from '#std'
import SocketIOClient, {Socket} from 'socket.io-client'

export type SocketIOSenderOptions = {
    endpoint: string
    event: string
}

export class SocketIOSender extends Sender {
    client?: Socket
    options: SocketIOSenderOptions

    constructor(options: SocketIOSenderOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting socket-io client')

        this.client = SocketIOClient(this.options.endpoint)

        this.client.on('connect', () => {
            std.log(`socket-io client connected`, {id: this.client!.id})
            this.resolveReady()
        })

        this.client.on('connect_error', error => {
            std.log(`socket-io client errored`, {error})
        })

        this.client.on('close', reason => {
            std.log(`socket-io client closed`, {reason})
        })

        this.client.on('disconnect', reason => {
            std.log(`socket-io client disconnected`, {reason})
        })
    }

    async send(message: Message) {
        std.log('socket-io client sending', {message})
        assert.isDefined(this.client, 'socket-io client not started')
        this.client.emit(this.options.event, message)
        std.log('socket-io client sent')
    }

    async stop() {
        // TODO: wait for disconnect
        std.log('stopping socket-io client')
        if (check.isDefined(this.client)) this.client.disconnect()
        std.log('stopped socket-io client')
    }
}
