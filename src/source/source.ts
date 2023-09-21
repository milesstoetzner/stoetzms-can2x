import Message from '#core/message'
import {Processor} from '#core/types'
import * as utils from '#utils'

export default abstract class Source {
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

    async receive(processor: Processor) {
        this.processor = processor
    }

    async send(message: Message): Promise<void> {
        throw new Error(`Not Implemented`)
    }

    continuous = true
}
