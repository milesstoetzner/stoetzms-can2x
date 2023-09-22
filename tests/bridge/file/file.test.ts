import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'

describe('file', () => {
    it('file2file', async () => {
        const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})

        const input = files.temporary()
        await files.createFile(input)

        const output = files.temporary()
        await files.createFile(output)

        const file2file = await actions.bridge.start({
            source: 'file',
            sourceFile: input,
            target: 'file',
            targetFile: output,
        })

        const first = await actions.bridge.start({
            source: 'console',
            sourceId: String(message.id),
            sourceData: message.data.map(String),
            target: 'file',
            targetFile: input,
        })

        const second = await actions.bridge.start({
            source: 'console',
            sourceId: String(message.id),
            sourceData: message.data.map(String),
            target: 'file',
            targetFile: input,
        })

        std.log('waiting for message being bridged')
        await utils.sleep(25)

        expect(files.loadFile(output).trim().split('\n')).to.deep.equal([message.toString(), message.toString()])

        await second.stop()
        await first.stop()
        await file2file.stop()

        await files.deleteFile(output)
        await files.deleteFile(input)
    })
})
