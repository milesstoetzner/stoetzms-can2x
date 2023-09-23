import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import hae from '#utils/hae'
import {expect} from 'chai'
import {afterEach} from 'mocha'

/**
 * console2can --(can2x1)--> can2socketio -> socketio2can --(can2x2)--> can2file
 */
describe('complex', () => {
    const cans = ['can2x1', 'can2x2']

    beforeEach(async () => {
        for (const can of cans) {
            await hae.try(async () => {
                await actions.vcan.start({name: can})
            }, `problem when creating vcan "${can}"`)
        }
    })

    it('complex', async () => {
        const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})
        const output = files.temporary()

        const can2file = await actions.bridge.start({
            source: 'can',
            sourceName: cans[1],
            target: 'file',
            targetFile: output,
        })

        const socketio2can = await actions.bridge.start({
            source: 'socketio',
            sourcePort: '3010',
            target: 'can',
            targetName: cans[1],
        })

        const can2socketio = await actions.bridge.start({
            source: 'can',
            sourceName: cans[0],
            target: 'socketio',
            targetEndpoint: 'http://localhost:3010',
        })

        const console2can = await actions.bridge.start({
            source: 'console',
            sourceId: String(message.id),
            sourceData: message.data.map(String),
            sourceExt: message.ext,
            sourceRtr: message.rtr,
            target: 'can',
            targetName: cans[0],
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
        for (const can of cans) {
            await hae.try(async () => {
                await actions.vcan.stop({name: can})
            }, `problem when stopping vcan "${can}"`)
        }
    })
})
