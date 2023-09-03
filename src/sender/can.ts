import {Message} from '#/core/message'
import {Sender} from '#/sender/sender'
import * as assert from '#assert'
import * as check from '#check'
import std from '#std'
import {RawChannel} from '*can.node'
import * as can from 'socketcan'

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
        // TODO: does this have a site-effect on the os?
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

    async stop() {
        std.log('stopping can client')
        if (check.isUndefined(this.channel)) return std.log('can client undefined')
        try {
            this.channel.stop()
            std.log('can client stopped')
        } catch (error) {
            // TODO: why doesnt this throw the same error when stopping the can server
            std.log('stopping can client failed', {error: error})
        }
    }
}
