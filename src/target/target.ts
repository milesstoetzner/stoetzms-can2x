import {Message} from '#core/message'
import * as utils from '#utils'

export abstract class Target {
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
}
