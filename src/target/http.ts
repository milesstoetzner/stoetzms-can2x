import Target from '#/target/target'
import Message from '#core/message'
import std from '#std'
import fetch from 'cross-fetch'

export type HTTPTargetOptions = {
    endpoint: string
}

export class HTTPTarget extends Target {
    options: HTTPTargetOptions

    constructor(options: HTTPTargetOptions) {
        super()
        this.options = options
    }

    async send(message: Message) {
        std.log('http target sending', {message})
        await fetch(this.options.endpoint, {
            method: 'POST',
            body: message.toString(),
            headers: {'Content-Type': 'application/json'},
        })
        std.log('http target sent')
    }
}
