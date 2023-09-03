import {Message} from '#/core/message'
import {Processor, Receiver} from '#/receiver/receiver'
import std from '#std'

export type ConsoleReceiverOptions = Message

export class ConsoleReceiver extends Receiver {
    options: ConsoleReceiverOptions

    constructor(options: ConsoleReceiverOptions) {
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
