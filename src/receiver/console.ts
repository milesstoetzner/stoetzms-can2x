import {Processor, Receiver} from '#/receiver/receiver'
import {Message} from '#/types'

export type ConsoleReceiverOptions = Message

export class ConsoleReceiver extends Receiver {
    options: ConsoleReceiverOptions

    constructor(options: ConsoleReceiverOptions) {
        super()
        this.options = options
    }

    async receive(processor: Processor) {
        this.processor = processor
        this.processor({id: this.options.id, data: this.options.data})
    }

    continuous = false
}
