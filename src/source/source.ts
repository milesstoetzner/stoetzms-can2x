import Message from '#core/message'
import {Processor} from '#core/types'
import * as utils from '#utils'

export default abstract class Source {
    processor?: Processor

    protected readyPromise

    protected constructor() {
        this.readyPromise = utils.createDecomposedPromise()
    }

    abstract start(): Promise<void>

    async ready() {
        return this.readyPromise.promise
    }

    abstract stop(): Promise<void>

    async receive(processor: Processor) {
        this.processor = processor
    }

    async send(message: Message): Promise<void> {
        throw new Error(`Not Implemented`)
    }

    continuous = true
}
