import * as utils from '#utils'

export default abstract class Bus {
    protected readyPromise

    protected constructor() {
        this.readyPromise = utils.createDecomposedPromise()
    }

    abstract start(): Promise<void>

    abstract stop(): Promise<void>

    async ready() {
        return this.readyPromise.promise
    }
}
