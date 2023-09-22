import Bus from '#/bus/bus'
import actions from '#actions'
import * as check from '#check'
import Message, {CANMessage} from '#core/message'
import std from '#std'
import hae from '#utils/hae'
import {RawChannel} from '*can.node'
import * as can from 'socketcan'

export type CANBusOptions = {
    name: string
}

export class CANBus extends Bus {
    channel?: RawChannel
    options: CANBusOptions

    constructor(options: CANBusOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting can bus', {options: this.options})
        await actions.vcan.start({name: this.options.name})

        this.channel = can.createRawChannel(this.options.name)
        this.channel.addListener('onMessage', function (message: CANMessage) {
            std.log('can bus received', {message: Message.fromCAN(message).toJSON()})
        })
        this.channel.start()

        this.setReady()
        std.log('can bus started')
    }

    async stop() {
        std.log('stopping can bus')

        await hae.try(async () => {
            if (check.isUndefined(this.channel)) return std.log('can bus channel not defined')
            this.channel.stop()
        }, 'problem while stopping can bus channel')

        await hae.try(async () => {
            await actions.vcan.stop({name: this.options.name})
        }, 'problem while stopping can bus vcan')

        std.log('can bus stopped')
    }
}
