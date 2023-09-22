import Message from '#core/message'
import {Processor} from '#core/types'
import * as utils from '#utils'

export default abstract class Target {
    processor?: Processor

    protected readyPromise

    protected constructor() {
        this.readyPromise = utils.createDecomposedPromise()
    }

    abstract start(): Promise<void>

    protected setReady() {
        this.readyPromise.resolve()
    }

    async ready() {
        return this.readyPromise.promise
    }

    abstract stop(): Promise<void>

    abstract send(message: Message): Promise<void>

    async receive(processor: Processor) {
        this.processor = processor
    }
}
