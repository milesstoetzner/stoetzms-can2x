import {Receiver} from '#/receiver/receiver'
import * as check from '#check'
import std from '#std'
import {Message as CANMessage, RawChannel} from '*can.node'
import * as can from 'socketcan'

export type CANReceiverOptions = {
    name: string
}

export class CanReceiver extends Receiver {
    channel?: RawChannel
    options: CANReceiverOptions

    constructor(options: CANReceiverOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting can server', {options: this.options})

        this.channel = can.createRawChannel(this.options.name)
        this.channel.start()

        this.channel.addListener('onMessage', (message: CANMessage) => {
            std.log('can server received', {message})
            if (check.isUndefined(this.processor)) return std.log('no processor defined')
            this.processor({id: message.id, data: Array.from(message.data)})
        })

        this.resolveReady()
        std.log('can server started')
    }

    async stop() {
        std.log('stopping can server')
        if (check.isUndefined(this.channel)) return std.log('can server not defined')
        this.channel.stop()
        std.log('can server stopped')
    }
}
