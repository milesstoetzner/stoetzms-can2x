import Message, {JSONMessage} from '#core/message'
import {expect} from 'chai'

describe('message', () => {
    it('from-to', async () => {
        const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})
        const result = Message.fromJSON(Message.fromCAN(Message.fromString(message.copy().toString()).toCAN()).toJSON())
        expect(result.toString()).to.equal(message.toString())
    })

    const valid: JSONMessage[] = [
        {id: 0, data: [], ext: false, rtr: false},
        {id: 0x7ff, data: [0, 255], ext: false, rtr: false},
        {id: 0x1fffffff, data: [1, 2, 3, 4, 5, 6, 7, 8], ext: true, rtr: false},
        {id: 0x123, data: [], ext: false, rtr: true},
    ]

    for (const message of valid) {
        it(`accepts ${JSON.stringify(message)}`, () => {
            expect(Message.fromJSON(message).toJSON()).to.deep.equal({...message, origin: undefined})
        })
    }

    const invalid: [string, JSONMessage, string][] = [
        ['negative id', {id: -1, data: [], ext: false, rtr: false}, 'is not a valid standard (11-bit) id'],
        ['standard id above 11 bits', {id: 0x800, data: [], ext: false, rtr: false}, 'is not a valid standard'],
        ['extended id above 29 bits', {id: 0x20000000, data: [], ext: true, rtr: false}, 'is not a valid extended'],
        ['fractional id', {id: 1.5, data: [], ext: false, rtr: false}, 'is not a valid standard'],
        ['NaN id', {id: NaN, data: [], ext: false, rtr: false}, 'is not a valid standard'],
        ['more than 8 bytes', {id: 1, data: [1, 2, 3, 4, 5, 6, 7, 8, 9], ext: false, rtr: false}, 'at most 8'],
        ['byte above 255', {id: 1, data: [256], ext: false, rtr: false}, 'is not an integer between 0 and 255'],
        ['negative byte', {id: 1, data: [-1], ext: false, rtr: false}, 'is not an integer between 0 and 255'],
        ['NaN byte', {id: 1, data: [NaN], ext: false, rtr: false}, 'is not an integer between 0 and 255'],
    ]

    for (const [name, message, error] of invalid) {
        it(`rejects ${name}`, () => {
            expect(() => Message.fromJSON(message)).to.throw(error)
        })
    }
})
