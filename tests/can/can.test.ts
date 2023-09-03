import {Message} from '#/core/message'
import * as actions from '#actions'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'
import hae from '#utils/hae'
import {VCAN} from '#/core/vcan'
import {afterEach} from 'mocha'

describe('can', () => {

    const vcan = 'can2x'

    beforeEach(async () => {
        try {
            await actions.startVCAN({
                name: vcan,
            })
        } catch (error) {
            std.log('vcan not created', {error})
        }
    })

    it('sender-receiver', async () => {
        const message: Message = {id: 69, data: [1, 2, 3]}
        const output = files.temporary()

        // Start can receiver with file sender
        const receiver = await actions.startBridge({
            receiver: 'can',
            receiverName: vcan,
            sender: 'file',
            senderFile: output,
        })

        // Send message using console receiver and can sender
        const sender = await actions.startBridge({
            receiver: 'console',
            receiverId: String(message.id),
            receiverData: message.data.map(String),
            sender: 'can',
            senderName: vcan,
        })

        std.log('waiting for message being bridged')
        await utils.sleep(25)

        expect(files.loadFile(output).trim()).to.equal(JSON.stringify(message))

        await files.deleteFile(output)
        await sender.stop()
        await receiver.stop()
    })

    afterEach(async () => {
        try {
            await actions.stopVCAN({
                name: vcan,
            })
        } catch (error) {
            std.log('vcan not stopped', {error})
        }
    })
})
