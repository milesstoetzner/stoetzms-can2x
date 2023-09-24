import Target from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import Message, {CANMessage} from '#core/message'
import std from '#std'
import hae from '#utils/hae'
import {RawChannel} from '*can.node'
import * as can from 'socketcan'

export type CANTargetOptions = {
    name: string
    bidirectional: boolean
}

export class CANTarget extends Target {
    target?: RawChannel
    options: CANTargetOptions

    constructor(options: CANTargetOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting can target', {options: this.options})
        this.target = can.createRawChannelWithOptions(this.options.name, {non_block_send: true})
        // TODO: does this have a site-effect on the os?
        this.target.start()

        if (this.options.bidirectional) {
            this.target.addListener('onMessage', (message: CANMessage) => {
                std.log('can source received', {message})
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(Message.fromCAN(message))
            })
        }

        this.setReady()
        std.log('can target started')
    }

    async send(message: Message) {
        std.log('can target sending', {message, options: this.options})
        assert.isDefined(this.target, 'can target not started')
        this.target.send(message.toCAN())
        std.log('can target sent')
    }

    async stop() {
        std.log('stopping can target')
        await hae.try(async () => {
            if (check.isUndefined(this.target)) return std.log('can target undefined')
            try {
                this.target.stop()
            } catch (error) {
                if (!error.message.includes('Channel not started')) throw error
            }
        }, 'problem when stopping can target')
        std.log('can target stopped')
    }
}
