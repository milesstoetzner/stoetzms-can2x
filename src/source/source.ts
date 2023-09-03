import {Message} from '#/core/message'

export type Processor = (message: Message) => Promise<void>

export abstract class Source {
    processor?: Processor
    options = {}

    async start() {
        this.resolveReady()
    }

    protected readyPromise = new Promise<void>((resolve, reject) => {
        this.resolveReady = resolve
        this.rejectReady = reject
    })
    protected resolveReady!: (value: void | PromiseLike<void>) => void
    protected rejectReady!: (reason?: any) => void
    async ready() {
        return this.readyPromise
    }

    async stop() {
        // nil
    }

    async receive(processor: Processor) {
        this.processor = processor
    }

    continuous = true
}
