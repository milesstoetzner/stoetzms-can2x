import {Message} from '#/types'
import * as actions from '#actions'
import * as files from '#files'
import * as utils from '#utils'
import {expect} from 'chai'

describe('socket-io', () => {
    it('sender-receiver', async () => {
        const message: Message = {id: 69, data: [1, 2, 3]}
        const output = files.temporary()

        // Start socket-io receiver with file sender
        actions.bridge({
            receiver: 'socket-io',
            sender: 'file',
            senderFile: output,
        })
        await utils.sleep(5 * 1000)

        // Send message using console receiver and socket-io sender
        actions.bridge({
            receiver: 'console',
            receiverId: String(message.id),
            receiverData: message.data.map(String),
            sender: 'socket-io',
            senderEndpoint: 'http://localhost:4269',
        })

        expect(files.loadFile(output)).to.equal(JSON.stringify(message))
        await files.deleteFile(output)
    }).timeout(10 * 1000)
})
