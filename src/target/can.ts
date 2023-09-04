import {Target} from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import {Message} from '#core/message'
import std from '#std'
import {RawChannel} from '*can.node'
import * as can from 'socketcan'

export type CANTargetOptions = {
    name: string
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
        this.target = can.createRawChannel(this.options.name)
        // TODO: does this have a site-effect on the os?
        this.target.start()
        this.readyPromise.resolve()
        std.log('can target started')
    }

    async send(message: Message) {
        std.log('can target sending', {message})
        assert.isDefined(this.target, 'can target not started')
        this.target.send({ext: false, rtr: false, id: message.id, data: Buffer.from(message.data)})
        std.log('can target sent')
    }

    async stop() {
        std.log('stopping can target')
        if (check.isUndefined(this.target)) return std.log('can target undefined')
        try {
            this.target.stop()
            std.log('can target stopped')
        } catch (error) {
            // TODO: why doesnt this throw the same error when stopping the can server
            std.log('stopping can target failed', {error: error})
        }
    }
}
