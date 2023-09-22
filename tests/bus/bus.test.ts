import {BridgeTargetOptions} from '#/actions/start-bridge'
import {BusOptions} from '#/actions/start-bus'
import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import hae from '#utils/hae'
import {expect} from 'chai'

describe.only('bus', () => {
    createBusTest(
        'can',
        {bus: 'can', name: 'can2x0'},
        {
            target: 'can',
            targetName: 'can2x0',
        }
    )

    /**
    createBusTest(
        'mqtt',
        {bus: 'mqtt'},
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3000',
        }
    )
        **/

    createBusTest(
        'socketio',
        {bus: 'socketio'},
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3000',
        }
    )
    /**
     **/

    /**
    createBusTest(
        'ws',
        {bus: 'ws'},
        {
            target: 'ws',
            targetEndpoint: 'ws://localhost:3000',
        }
    )
        **/
})

function createBusTest(name: string, busOptions: BusOptions, bridgeTargetOptions: BridgeTargetOptions) {
    return it(name, async () => {
        const cans = ['can2x1', 'can2x2', 'can2x3']
        for (const can of cans) {
            await hae.try(async () => {
                await actions.vcan.start({name: can})
            }, `problem when creating vcan "${can}"`)
        }

        const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})

        // Bus
        const bus = await actions.bus.start(busOptions)

        // Client 1
        const file1 = files.temporary()
        const logger1 = await actions.bridge.start({
            source: 'can',
            sourceName: cans[0],
            target: 'file',
            targetFile: file1,
        })
        const bridge1 = await actions.bridge.start({
            source: 'can',
            sourceName: cans[0],
            ...bridgeTargetOptions,
        })

        // Client 2
        const file2 = files.temporary()
        const logger2 = await actions.bridge.start({
            source: 'can',
            sourceName: cans[1],
            target: 'file',
            targetFile: file2,
        })
        const bridge2 = await actions.bridge.start({
            source: 'can',
            sourceName: cans[1],
            ...bridgeTargetOptions,
        })

        // Client 3
        const file3 = files.temporary()
        const logger3 = await actions.bridge.start({
            source: 'can',
            sourceName: cans[2],
            target: 'file',
            targetFile: file3,
        })
        const bridge3 = await actions.bridge.start({
            source: 'can',
            sourceName: cans[2],
            ...bridgeTargetOptions,
        })

        // Sender
        const sender = await actions.bridge.start({
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

        for (const can of cans) {
            await hae.try(async () => {
                await actions.vcan.stop({name: can})
            }, `problem when stopping vcan "${can}"`)
        }
    })
}
