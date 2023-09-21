import actions from '#actions'
import Message, {CANMessage} from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'
import {afterEach} from 'mocha'
import * as can from 'socketcan'

describe('bidirectional', () => {
    const can2xA = 'can2xBixA'
    const can2xB = 'can2xBixB'

    beforeEach(async () => {
        try {
            await actions.vcan.start({
                name: can2xA,
            })
            await actions.vcan.start({
                name: can2xB,
            })
        } catch (error) {
            std.log('vcan not created', {error})
        }
    })

    it('bidirectional', async () => {
        const request = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})
        const response = Message.fromJSON({id: 42, data: [4, 5, 6], ext: false, rtr: false})
        const output = files.temporary()

        // Receives "message" and returns "answer"
        const receiver = can.createRawChannel(can2xB)
        receiver.addListener('onMessage', function (message: CANMessage) {
            std.log('receiver received', {message})
            expect(Message.fromCAN(message).toString()).to.equal(request.toString())
            receiver.send(response.toCAN())
        })
        receiver.start()

        // Start can source with file target
        const bridge = await actions.bridge.start({
            source: 'can',
            sourceName: can2xA,
            target: 'can',
            targetName: can2xB,
        })

        // Send message using console source and can target
        const logger = await actions.bridge.start({
            source: 'can',
            sourceName: can2xA,
            target: 'file',
            targetFile: output,
        })

        // Send message using console source and can target
        const sender = await actions.bridge.start({
            source: 'console',
            sourceId: String(request.id),
            sourceData: request.data.map(String),
            sourceExt: request.ext,
            sourceRtr: request.rtr,
            target: 'can',
            targetName: can2xA,
        })

        std.log('waiting for message being bridged')
        await utils.sleep(25)

        expect(files.loadFile(output).trim().split('\n')).to.deep.equal([request.toString(), response.toString()])

        await files.deleteFile(output)
        await sender.stop()
        await logger.stop()
        await bridge.stop()
    })

    afterEach(async () => {
        try {
            await actions.vcan.stop({
                name: can2xA,
            })
            await actions.vcan.stop({
                name: can2xB,
            })
        } catch (error) {
            std.log('vcan not stopped', {error})
        }
    })
})
