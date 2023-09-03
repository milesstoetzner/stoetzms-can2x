import {Source} from '#/source/source'
import * as check from '#check'
import std from '#std'
import {Message as CANMessage, RawChannel} from '*can.node'
import * as can from 'socketcan'

export type CANSourceOptions = {
    name: string
}

export class CANSource extends Source {
    source?: RawChannel
    options: CANSourceOptions

    constructor(options: CANSourceOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting can server', {options: this.options})

        this.source = can.createRawChannel(this.options.name)
        this.source.start()

        this.source.addListener('onMessage', (message: CANMessage) => {
            std.log('can server received', {message})
            if (check.isUndefined(this.processor)) return std.log('no processor defined')
            this.processor({id: message.id, data: Array.from(message.data)})
        })

        this.resolveReady()
        std.log('can server started')
    }

    async stop() {
        std.log('stopping can server')
        if (check.isUndefined(this.source)) return std.log('can server not defined')
        this.source.stop()
        std.log('can server stopped')
    }
}
