import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import {expect} from 'chai'

describe('bus', () => {
    const can2x1 = 'can2x1'
    const can2x2 = 'can2x2'
    const can2x3 = 'can2x3'

    beforeEach(async () => {
        try {
            await actions.vcan.start({
                name: can2x1,
            })
            await actions.vcan.start({
                name: can2x2,
            })
            await actions.vcan.start({
                name: can2x3,
            })
        } catch (error) {
            std.log('vcan not created', {error})
        }
    })

    it('bus', async () => {
        const target = 'socketio'
        const targetEndpoint = 'http://localhost:3000'
        const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})

        // Bus
        const bus = await actions.bus.start({
            bus: 'socketio',
            port: 3000,
        })

        // Client 1
        const file1 = files.temporary()
        const logger1 = await actions.bridge.start({
            source: 'can',
            sourceName: can2x1,
            target: 'file',
            targetFile: file1,
        })
        const bridge1 = await actions.bridge.start({
            source: 'can',
            sourceName: can2x1,
            target,
            targetEndpoint,
        })

        // Client 2
        const file2 = files.temporary()
        const logger2 = await actions.bridge.start({
            source: 'can',
            sourceName: can2x2,
            target: 'file',
            targetFile: file2,
        })
        const bridge2 = await actions.bridge.start({
            source: 'can',
            sourceName: can2x2,
            target,
            targetEndpoint,
        })

        // Client 3
        const file3 = files.temporary()
        const logger3 = await actions.bridge.start({
            source: 'can',
            sourceName: can2x3,
            target: 'file',
            targetFile: file3,
        })
        const bridge3 = await actions.bridge.start({
            source: 'can',
            sourceName: can2x3,
            target,
            targetEndpoint,
        })

        // Sender
        const sender = await actions.bridge.start({
            source: 'console',
            sourceId: String(message.id),
            sourceData: message.data.map(String),
            sourceExt: message.ext,
            sourceRtr: message.rtr,
            target: 'can',
            targetName: can2x1,
        })

        std.log('waiting for message being bridged')
        await utils.sleep(250)

        expect(files.loadFile(file1).trim()).to.equal(message.toString())
        expect(files.loadFile(file2).trim()).to.equal(message.toString())
        expect(files.loadFile(file3).trim()).to.equal(message.toString())

        await files.deleteFile(file1)
        await logger1.stop()
        await bridge1.stop()

        await files.deleteFile(file2)
        await logger2.stop()
        await bridge2.stop()

        await files.deleteFile(file3)
        await logger3.stop()
        await bridge3.stop()

        await sender.stop()
        await bus.stop()
    })

    afterEach(async () => {
        try {
            await actions.vcan.stop({
                name: can2x1,
            })
            await actions.vcan.stop({
                name: can2x2,
            })
            await actions.vcan.stop({
                name: can2x3,
            })
        } catch (error) {
            std.log('vcan not stopped', {error})
        }
    })
})
