import Source from '#/source/source'
import Message from '#core/message'
import {Processor} from '#core/types'
import std from '#std'

export type ConsoleSourceOptions = {id: number; data: number[]; ext: boolean; rtr: boolean}

export class ConsoleSource extends Source {
    options: ConsoleSourceOptions

    constructor(options: ConsoleSourceOptions) {
        super()
        this.options = options
    }

    async receive(processor: Processor) {
        const message = Message.fromJSON({
            id: this.options.id,
            data: this.options.data,
            ext: this.options.ext,
            rtr: this.options.rtr,
        })
        std.log('console received', {message})
        this.processor = processor
        this.processor(message)
    }

    continuous = false
}
