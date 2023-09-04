import {Message} from '#core/message'
import * as utils from '#utils'

export type Processor = (message: Message) => Promise<void>

export abstract class Source {
    processor?: Processor
    options = {}

    protected readyPromise

    protected constructor() {
        this.readyPromise = utils.createOutsidePromise()
    }

    async start() {
        this.readyPromise.resolve()
    }

    async ready() {
        return this.readyPromise.promise
    }

    async stop() {
        // nil
    }

    async receive(processor: Processor) {
        this.processor = processor
    }

    continuous = true
}
