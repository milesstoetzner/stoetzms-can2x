import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'

describe('mqtt', () => {
    it('source-target', async () => {
        const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})
        const output = files.temporary()
        const port = 3000

        // Start mqtt source with file target
        const source = await actions.bridge.start({
            source: 'mqtt',
            sourcePort: String(port),
            target: 'file',
            targetFile: output,
        })

        // Send message using console source and mqtt target
        const target = await actions.bridge.start({
            source: 'console',
            sourceId: String(message.id),
            sourceData: message.data.map(String),
            target: 'mqtt',
            targetEndpoint: `mqtt://localhost:${port}`,
        })

        std.log('waiting for message being bridged')
        await utils.sleep(25)

        expect(files.loadFile(output).trim()).to.equal(message.toString())

        await files.deleteFile(output)
        await target.stop()
        await source.stop()
    })
})
