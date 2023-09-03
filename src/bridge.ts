import {Receiver} from '#/receiver/receiver'
import {Sender} from '#/sender/sender'
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
        await this.receiver.start()
        await this.sender.start()

        await this.receiver.receive(
            hae.log(async message => {
                std.log(message.id, message.data)
                await this.sender.send(message)
            })
        )
    }

    async stop() {
        await this.receiver.stop()
        await this.sender.stop()
    }
}
