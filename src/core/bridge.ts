import {Receiver} from '#/receiver/receiver'
import {Sender} from '#/sender/sender'
import * as assert from '#assert'
import std from '#std'
import hae from '#utils/hae'

export class Bridge {
    receiver: Receiver
    sender: Sender

    constructor(receiver: Receiver, sender: Sender) {
        this.receiver = receiver
        this.sender = sender
    }

    async start() {
        std.log('starting receiver')
        await this.receiver.start()

        std.log('starting sender')
        await this.sender.start()

        await this.receiver.ready()
        std.log('receiver ready')

        await this.sender.ready()
        std.log('sender ready')

        std.log('bridge started')
        await this.receiver.receive(
            hae.log(async message => {
                std.log('bridging', {message})

                assert.isNumber(message.id)
                assert.isArray(message.data)
                message.data.forEach(assert.isNumber)

                await this.sender.send(message)
                if (!this.receiver.continuous) await this.stop()
            })
        )
    }

    async stop() {
        std.log('stopping bridge')
        await this.receiver.stop()
        await this.sender.stop()
        std.log('bridge stopped')
    }
}
