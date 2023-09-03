import {Message} from '#/types'

export abstract class Sender {
    async start() {
        this.resolveReady()
    }

    // TODO: call resolve everywhere
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

    abstract send(message: Message): Promise<void>
}
