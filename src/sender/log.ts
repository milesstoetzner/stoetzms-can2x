import {Message} from "#/types";
import {Sender} from "#/sender/sender";

export class LogSender extends Sender {

    async send(message: Message) {
        console.log(message.id, message.data)
    }
}