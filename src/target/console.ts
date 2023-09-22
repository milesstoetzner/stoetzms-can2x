import Target from '#/target/target'
import Message from '#core/message'
import std from '#std'

export class ConsoleTarget extends Target {
    constructor() {
        super()
    }

    async start() {
        std.log('starting console target')
        this.readyPromise.resolve()
        std.log('console target started')
    }

    async send(message: Message) {
        std.log('console target sending', {message})
        std.out(message.toString())
        std.log('console target sent')
    }

    async stop() {
        std.log('stopping console target')
        std.log('console target stopped')
    }
}
