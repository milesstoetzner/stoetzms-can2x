import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'
import {afterEach} from 'mocha'

/**
 * console2can --(can2x1)--> can2socketio -> socketio2can --(can2x2)--> can2file
 */
describe('complex', () => {
    beforeEach(async () => {
        try {
            await actions.vcan.start({
                name: 'can2x1',
            })
        } catch (error) {
            std.log('vcan "can2x1" not created', {error})
        }

        try {
            await actions.vcan.start({
                name: 'can2x2',
            })
        } catch (error) {
            std.log('vcan "can2x2" not created', {error})
        }
    })

    it('source-target', async () => {
        const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})
        const output = files.temporary()

        const can2file = await actions.bridge.start({
            source: 'can',
            sourceName: 'can2x2',
            target: 'file',
            targetFile: output,
        })

        const socketio2can = await actions.bridge.start({
            source: 'socketio',
            target: 'can',
            targetName: 'can2x2',
        })

        const can2socketio = await actions.bridge.start({
            source: 'can',
            sourceName: 'can2x1',
            target: 'socketio',
            targetEndpoint: 'http://localhost:3000',
        })

        const console2can = await actions.bridge.start({
            source: 'console',
            sourceId: String(message.id),
            sourceData: message.data.map(String),
            sourceExt: message.ext,
            sourceRtr: message.rtr,
            target: 'can',
            targetName: 'can2x1',
        })

        std.log('waiting for message being bridged')
        await utils.sleep(250)

        expect(files.loadFile(output).trim()).to.equal(message.toString())

        await files.deleteFile(output)
        await console2can.stop()
        await can2socketio.stop()
        await socketio2can.stop()
        await can2file.stop()
    })

    afterEach(async () => {
        try {
            await actions.vcan.stop({
                name: 'can2x1',
            })
        } catch (error) {
            std.log('vcan "can2x1" not stopped', {error})
        }

        try {
            await actions.vcan.stop({
                name: 'can2x2',
            })
        } catch (error) {
            std.log('vcan "can2x" not stopped', {error})
        }
    })
})
