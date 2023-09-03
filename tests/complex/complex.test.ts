import {Message} from '#/core/message'
import * as actions from '#actions'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'
import {afterEach} from 'mocha'

/**
 * console2can --(can2x1)--> can2socket-io -> socket-io2can --(can2x2)--> can2file
 */
describe('complex', () => {
    beforeEach(async () => {
        try {
            await actions.startVCAN({
                name: 'can2x1',
            })
        } catch (error) {
            std.log('vcan "can2x1" not created', {error})
        }

        try {
            await actions.startVCAN({
                name: 'can2x2',
            })
        } catch (error) {
            std.log('vcan "can2x2" not created', {error})
        }
    })

    it('sender-receiver', async () => {
        const message: Message = {id: 69, data: [1, 2, 3]}
        const output = files.temporary()

        const can2file = await actions.startBridge({
            receiver: 'can',
            receiverName: 'can2x2',
            sender: 'file',
            senderFile: output,
        })

        const socketio2can = await actions.startBridge({
            receiver: 'socket-io',
            sender: 'can',
            senderName: 'can2x2',
        })

        const can2socketio = await actions.startBridge({
            receiver: 'can',
            receiverName: 'can2x1',
            sender: 'socket-io',
            senderEndpoint: 'http://localhost:3000',
        })

        const console2can = await actions.startBridge({
            receiver: 'console',
            receiverId: String(message.id),
            receiverData: message.data.map(String),
            sender: 'can',
            senderName: 'can2x1',
        })

        std.log('waiting for message being bridged')
        await utils.sleep(50)

        expect(files.loadFile(output).trim()).to.equal(JSON.stringify(message))

        await files.deleteFile(output)
        await console2can.stop()
        await can2socketio.stop()
        await socketio2can.stop()
        await can2file.stop()
    })

    afterEach(async () => {
        try {
            await actions.stopVCAN({
                name: 'can2x1',
            })
        } catch (error) {
            std.log('vcan "can2x1" not stopped', {error})
        }

        try {
            await actions.stopVCAN({
                name: 'can2x2',
            })
        } catch (error) {
            std.log('vcan "can2x" not stopped', {error})
        }
    })
})
