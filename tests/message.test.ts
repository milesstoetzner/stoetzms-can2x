import Message from '#core/message'
import {expect} from 'chai'

describe('message', () => {
    it('from-to', async () => {
        const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})
        const result = Message.fromJSON(Message.fromCAN(Message.fromString(message.copy().toString()).toCAN()).toJSON())
        expect(result.toString()).to.equal(message.toString())
    })
})
