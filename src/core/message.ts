import * as assert from '#assert'
import {Message as CANMessage} from '*can.node'

export type Message = {
    id: number
    data: number[]
}

export function fromCAN(message: CANMessage): Message {
    return {id: message.id, data: Array.from(message.data)}
}

export function toCAN(message: Message): CANMessage {
    return {id: message.id, data: Buffer.from(message.data), ext: false, rtr: false}
}

export function validateMessage(message: Message) {
    assert.isNumber(message.id)
    assert.isNumbers(message.data)
}
