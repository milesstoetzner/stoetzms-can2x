import {Message} from '#/core/message'
import {Processor, Source} from '#/source/source'
import std from '#std'

export type ConsoleSourceOptions = Message

export class ConsoleSource extends Source {
    options: ConsoleSourceOptions

    constructor(options: ConsoleSourceOptions) {
        super()
        this.options = options
    }

    async receive(processor: Processor) {
        const message = {id: this.options.id, data: this.options.data}
        std.log('console received', {message})
        this.processor = processor
        this.processor(message)
    }

    continuous = false
}
