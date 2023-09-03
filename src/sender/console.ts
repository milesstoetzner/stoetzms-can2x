import {Sender} from '#/sender/sender'
import {Message} from '#/types'
import std from '#std'

export class ConsoleSender extends Sender {
    async send(message: Message) {
        std.out(message.id, message.data)
    }
}
