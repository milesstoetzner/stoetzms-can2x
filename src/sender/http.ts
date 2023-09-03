import {Sender} from '#/sender/sender'
import {Message} from '#/types'
import fetch from 'cross-fetch'

export type HTTPSenderOptions = {
    endpoint: string
}

export class HTTPSender extends Sender {
    options: HTTPSenderOptions

    constructor(options: HTTPSenderOptions) {
        super()
        this.options = options
    }

    async send(message: Message) {
        await fetch(this.options.endpoint, {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {'Content-Type': 'application/json'},
        })
    }
}