import Target from '#/target/target'
import Message from '#core/message'
import std from '#std'
import fetch from 'cross-fetch'

export type HTTPTargetOptions = {
    endpoint: string
}

export class HTTPTarget extends Target {
    options: HTTPTargetOptions
    private sending: Promise<void> = Promise.resolve()

    constructor(options: HTTPTargetOptions) {
        super()
        this.options = options
    }

    async send(message: Message) {
        // Send one request after another, since concurrent requests may arrive out of order
        const sending = this.sending.then(() => this.post(message))
        this.sending = sending.catch(() => undefined)
        return sending
    }

    private async post(message: Message) {
        std.log('http target sending', {message})
        await fetch(this.options.endpoint, {
            method: 'POST',
            body: message.toString(),
            headers: {'Content-Type': 'application/json'},
        })
        std.log('http target sent')
    }

    async start() {
        std.log('starting http target')
        this.setReady()
        std.log('http target started')
    }

    async stop() {
        std.log('stopping http target')
        std.log('http target stopped')
    }
}
