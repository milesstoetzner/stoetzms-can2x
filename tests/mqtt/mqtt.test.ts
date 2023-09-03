import {Message} from '#/types'
import * as actions from '#actions'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'

describe('mqtt', () => {
    it('sender-receiver', async () => {
        const message: Message = {id: 69, data: [1, 2, 3]}
        const output = files.temporary()
        const port = 3000

        // Start mqtt receiver with file sender
        const receiver = await actions.createBridge({
            receiver: 'mqtt',
            receiverPort: String(port),
            sender: 'file',
            senderFile: output,
        })

        // Send message using console receiver and mqtt sender
        const sender = await actions.createBridge({
            receiver: 'console',
            receiverId: String(message.id),
            receiverData: message.data.map(String),
            sender: 'mqtt',
            senderEndpoint: `mqtt://localhost:${port}`,
        })

        std.log('waiting for message being bridged')
        await utils.sleep(25)

        expect(files.loadFile(output).trim()).to.equal(JSON.stringify(message))
        std.log('its the same')

        await files.deleteFile(output)
        await sender.stop()
        await receiver.stop()
    })
})