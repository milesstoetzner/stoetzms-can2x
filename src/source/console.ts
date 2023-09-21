import Source from '#/source/source'
import Message, {JSONMessage} from '#core/message'
import {Processor} from '#core/types'
import std from '#std'

export type ConsoleSourceOptions = JSONMessage

export class ConsoleSource extends Source {
    options: ConsoleSourceOptions

    constructor(options: ConsoleSourceOptions) {
        super()
        this.options = options
    }

    async receive(processor: Processor) {
        const message = Message.fromJSON(this.options)
        std.log('console received', {message})
        this.processor = processor
        this.processor(message)
    }

    continuous = false
}
