import * as assert from '#assert'
import * as check from '#check'
import {Message as _CANMessage} from '*can.node'
import _ from 'lodash'

export type CANMessage = _CANMessage

export type JSONMessage = {
    id: number
    data: number[]
    ext: boolean
    rtr: boolean
    origin?: string
}

export default class Message {
    id: number
    data: number[]
    ext: boolean
    rtr: boolean

    origin?: string

    private constructor(id: number, data: number[], ext: boolean, rtr: boolean, origin?: string) {
        assert.isNumber(id)
        assert.isNumbers(data)
        assert.isBoolean(ext)
        assert.isBoolean(rtr)
        if (check.isDefined(origin)) assert.isString(origin)

        this.id = id
        this.data = data
        this.ext = ext
        this.rtr = rtr
        this.origin = origin
    }

    static fromJSON(message: JSONMessage) {
        return new Message(message.id, message.data, message.ext, message.rtr, message.origin)
    }

    toJSON(): JSONMessage {
        return {id: this.id, data: this.data, ext: this.ext, rtr: this.rtr, origin: this.origin}
    }

    static fromString(message: string) {
        assert.isString(message)
        return this.fromJSON(JSON.parse(message))
    }

    toString() {
        return JSON.stringify(this.toJSON())
    }

    static fromCAN(message: CANMessage): Message {
        return this.fromJSON({
            id: message.id,
            data: Array.from(message.data),
            ext: message.ext ?? false,
            rtr: message.rtr ?? false,
        })
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

    copy() {
        return Message.fromJSON(_.cloneDeep(this.toJSON()))
    }

    clean() {
        delete this.origin
    }
}
