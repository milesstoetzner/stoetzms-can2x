import {Message} from '#core/message'
import {Processor} from '#core/types'
import * as utils from '#utils'

// TODO: merge this class with source?

export abstract class Target {
    processor?: Processor

    protected readyPromise
    protected constructor() {
        this.readyPromise = utils.createDecomposedPromise()
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

    abstract send(message: Message): Promise<void>

    async receive(processor: Processor) {
        this.processor = processor
    }
}
