import {Receiver} from '#/receiver/receiver'
import {Sender} from '#/sender/sender'
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

        this.receiver.receive(
            hae.log(async message => {
                console.debug(message.id, message.data)
                await this.sender.send(message)
            })
        )
    }

    stop() {
        this.receiver.stop()
        this.sender.stop()
    }
}
