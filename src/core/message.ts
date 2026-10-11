import * as assert from '#assert'
import * as check from '#check'
import * as socketcan from '#utils/socketcan'
import _ from 'lodash'

export type CANMessage = socketcan.CANMessage

const MAX_STANDARD_ID = 0x7ff
const MAX_EXTENDED_ID = 0x1fffffff
const MAX_DATA_LENGTH = 8

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

        const maxId = ext ? MAX_EXTENDED_ID : MAX_STANDARD_ID
        if (!Number.isInteger(id) || id < 0 || id > maxId)
            throw new Error(`CAN id "${id}" is not a valid ${ext ? 'extended (29-bit)' : 'standard (11-bit)'} id`)

        if (data.length > MAX_DATA_LENGTH)
            throw new Error(`CAN data has ${data.length} bytes, but at most ${MAX_DATA_LENGTH} are allowed`)

        for (const byte of data) {
            if (!Number.isInteger(byte) || byte < 0 || byte > 0xff)
                throw new Error(`CAN data byte "${byte}" is not an integer between 0 and 255`)
        }

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
