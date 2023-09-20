import * as assert from '#assert'
import {Message as CANMessage} from '*can.node'

export default class Message {
    id: number
    data: number[]

    // TODO: ext
    // TODO: rtr

    private constructor(id: number, data: number[]) {
        assert.isNumber(id)
        assert.isNumbers(data)

        this.id = id
        this.data = data
    }

    static fromJSON(message: {id: number; data: number[]}) {
        return new Message(message.id, message.data)
    }

    toJSON() {
        return {id: this.id, data: this.id}
    }

    static fromString(message: string) {
        assert.isString(message)
        return this.fromJSON(JSON.parse(message))
    }

    toString() {
        return JSON.stringify(this.toJSON())
    }

    static fromCAN(message: CANMessage): Message {
        return this.fromJSON({id: message.id, data: Array.from(message.data)})
    }

    toCAN(): CANMessage {
        return {id: this.id, data: Buffer.from(this.data), ext: false, rtr: false}
    }

    static fromArrayBuffer(message: ArrayBuffer | ArrayBuffer[]) {
        assert.isBuffer(message)
        return this.fromString(new TextDecoder().decode(message))
    }

    static fromBuffer(message: Buffer) {
        assert.isBuffer(message)
        return this.fromString(message.toString('utf-8'))
    }
}
