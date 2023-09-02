import {Message} from '#/types'

export type Processor = (message: Message) => Promise<void>

export abstract class Receiver {
    processor?: Processor
    options = {}

    async start() {
        // nil
    }

    async stop() {
        // nil
    }

    async receive(processor: Processor) {
        this.processor = processor
    }
}
