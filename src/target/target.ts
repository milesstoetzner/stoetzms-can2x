import {Message} from '#core/message'

export abstract class Target {
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

    abstract send(message: Message): Promise<void>
}
