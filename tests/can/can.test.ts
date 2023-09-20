import * as actions from '#core/actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'
import {afterEach} from 'mocha'

describe.skip('can', () => {
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

    it('source-target', async () => {
        const message = Message.fromJSON({id: 69, data: [1, 2, 3]})
        const output = files.temporary()

        // Start can source with file target
        const source = await actions.startBridge({
            source: 'can',
            sourceName: vcan,
            target: 'file',
            targetFile: output,
        })

        // Send message using console source and can target
        const target = await actions.startBridge({
            source: 'console',
            sourceId: String(message.id),
            sourceData: message.data.map(String),
            target: 'can',
            targetName: vcan,
        })

        std.log('waiting for message being bridged')
        await utils.sleep(25)

        expect(files.loadFile(output).trim()).to.equal(message.toString())

        await files.deleteFile(output)
        await target.stop()
        await source.stop()
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
