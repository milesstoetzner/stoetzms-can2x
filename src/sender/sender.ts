import {Message} from '#/types'

export abstract class Sender {
    async start() {
        // nil
    }

    async stop() {
        // nil
    }

    abstract send(message: Message): void
}
