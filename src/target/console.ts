import Target from '#/target/target'
import Message from '#core/message'
import std from '#std'

export class ConsoleTarget extends Target {
    constructor() {
        super()
    }

    async send(message: Message) {
        std.log('console target sending', {message})
        std.out(message.id, message.data)
        std.log('console target sent')
    }
}
