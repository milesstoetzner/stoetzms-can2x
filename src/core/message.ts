import * as assert from '#assert'
import {Message as CANMessage} from '*can.node'

export type Message = {
    id: number
    data: number[]
}

export function fromJSON(message: Message) {
    // TODO
    return message
}

export function toJSON(message: Message) {
    // TODO
    return message
}

export function fromString(message: string): Message {
    assert.isString(message)
    return JSON.parse(message)
}

export function toString(message: Message) {
    return JSON.stringify(message)
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

export function fromBuffer(message: ArrayBuffer | ArrayBuffer[]) {
    assert.isBuffer(message)
    return fromString(new TextDecoder().decode(message))
}

// TODO: class Message
