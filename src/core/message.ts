import * as assert from '#assert'
import {Message as CANMessage} from '*can.node'

export default class Message {
    id: number
    data: number[]
    ext: boolean
    rtr: boolean

    private constructor(id: number, data: number[], ext: boolean, rtr: boolean) {
        assert.isNumber(id)
        assert.isNumbers(data)

        this.id = id
        this.data = data
        this.ext = ext
        this.rtr = rtr
    }

    static fromJSON(message: {id: number; data: number[]; ext?: boolean; rtr?: boolean}) {
        return new Message(message.id, message.data, message.ext ?? false, message.rtr ?? false)
    }

    toJSON() {
        return {id: this.id, data: this.data}
    }

    static fromString(message: string) {
        assert.isString(message)
        return this.fromJSON(JSON.parse(message))
    }

    toString() {
        return JSON.stringify(this.toJSON())
    }

    static fromCAN(message: CANMessage): Message {
        return this.fromJSON({id: message.id, data: Array.from(message.data), ext: message.ext, rtr: message.rtr})
    }

    toCAN(): CANMessage {
        return {id: this.id, data: Buffer.from(this.data), ext: this.ext, rtr: this.rtr}
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
