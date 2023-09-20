import Source from '#/source/source'
import * as check from '#check'
import Message from '#core/message'
import std from '#std'
import {Message as CANMessage, RawChannel} from '*can.node'
import * as can from 'socketcan'

export type CANSourceOptions = {
    name: string
    bidirectional: boolean
}

export class CANSource extends Source {
    source?: RawChannel
    options: CANSourceOptions

    constructor(options: CANSourceOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting can source', {options: this.options})

        // TODO: non_block_send: false!?
        this.source = can.createRawChannelWithOptions(this.options.name, {non_block_send: true})
        this.source.start()

        this.source.addListener('onMessage', (message: CANMessage) => {
            std.log('can source received', {message})
            if (check.isUndefined(this.processor)) return std.log('no processor defined')
            this.processor(Message.fromCAN(message))
        })

        this.readyPromise.resolve()
        std.log('can source started')
    }

    async stop() {
        std.log('stopping can source')
        if (check.isUndefined(this.source)) return std.log('can source not defined')
        this.source.stop()
        std.log('can source stopped')
    }

    async send(message: Message) {
        std.log('sending can source')
        if (!this.options.bidirectional) return std.log('can source not bidirectional')

        if (check.isUndefined(this.source)) return std.log('can source not defined')
        this.source.send(message.toCAN())

        std.log('can source sent')
    }
}
