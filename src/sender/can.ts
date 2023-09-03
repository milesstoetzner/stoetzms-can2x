import {Message} from '#/core/message'
import {Sender} from '#/sender/sender'
import * as assert from '#assert'
import std from '#std'
import {RawChannel} from '*can.node'
import can from 'socketcan'

export type CANSenderOptions = {
    name: string
}

export class CANSender extends Sender {
    channel?: RawChannel
    options: CANSenderOptions

    constructor(options: CANSenderOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting can client', {options: this.options})
        this.channel = can.createRawChannel(this.options.name)
        this.channel.start()
        this.resolveReady()
        std.log('can client started')
    }

    async send(message: Message) {
        std.log('can client sending', {message})
        assert.isDefined(this.channel, 'can client not started')
        this.channel.send({ext: false, rtr: false, id: message.id, data: Buffer.from(message.data)})
        std.log('can client sent')
    }
}
