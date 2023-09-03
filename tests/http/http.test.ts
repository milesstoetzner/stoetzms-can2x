import {Message} from '#/core/message'
import * as actions from '#actions'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'

describe('http', () => {
    it('sender-receiver', async () => {
        const message: Message = {id: 69, data: [1, 2, 3]}
        const output = files.temporary()
        const port = 2999

        // Start http receiver with file sender
        const receiver = await actions.startBridge({
            receiver: 'http',
            receiverPort: String(port),
            sender: 'file',
            senderFile: output,
        })

        // Send message using console receiver and http sender
        const sender = await actions.startBridge({
            receiver: 'console',
            receiverId: String(message.id),
            receiverData: message.data.map(String),
            sender: 'http',
            senderEndpoint: `http://localhost:${port}`,
        })

        std.log('waiting for message being bridged')
        await utils.sleep(25)

        expect(files.loadFile(output).trim()).to.equal(JSON.stringify(message))

        await files.deleteFile(output)
        await sender.stop()
        await receiver.stop()
    })
})
