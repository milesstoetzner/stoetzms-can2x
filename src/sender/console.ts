import {Message} from '#/core/message'
import {Sender} from '#/sender/sender'
import std from '#std'

export class ConsoleSender extends Sender {
    async send(message: Message) {
        std.log('console sending', {message})
        std.out(message.id, message.data)
        std.log('console sent')
    }
}
