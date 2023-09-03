import {Sender} from '#/sender/sender'
import {Message} from '#/types'
import std from '#std'
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
        std.log('http sending', {message})
        await fetch(this.options.endpoint, {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {'Content-Type': 'application/json'},
        })
        std.log('http sent')
    }
}
