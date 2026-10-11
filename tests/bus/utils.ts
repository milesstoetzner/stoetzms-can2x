import {BridgeTargetOptions} from '#/actions/start-bridge'
import {BusOptions} from '#/actions/start-bus'
import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import hae from '#utils/hae'
import {expect} from 'chai'
import {afterEach} from 'mocha'
import {Stopper} from '../stopper'

export function createBusTest(name: string, busOptions: BusOptions, bridgeTargetOptions: BridgeTargetOptions) {
    return describe(name, () => {
        const stopper = new Stopper()
        afterEach(async () => await stopper.stop())

        const cans = ['can2x1', 'can2x2', 'can2x3']

        beforeEach(async () => {
            for (const can of cans) {
                await hae.try(async () => {
                    await actions.vcan.start({name: can})
                }, `problem when creating vcan "${can}"`)
            }
        })

        it(name, async () => {
            const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})

            // Bus
            const bus = stopper.add(await actions.bus.start(busOptions))

            // Client 1
            const file1 = files.temporary()
            await files.createFile(file1)
            const logger1 = stopper.add(
                await actions.bridge.start({
                    source: 'can',
                    sourceName: cans[0],
                    target: 'file',
                    targetFile: file1,
                })
            )
            const bridge1 = stopper.add(
                await actions.bridge.start({
                    source: 'can',
                    sourceName: cans[0],
                    ...bridgeTargetOptions,
                })
            )

            // Client 2
            const file2 = files.temporary()
            await files.createFile(file2)
            const logger2 = stopper.add(
                await actions.bridge.start({
                    source: 'can',
                    sourceName: cans[1],
                    target: 'file',
                    targetFile: file2,
                })
            )
            const bridge2 = stopper.add(
                await actions.bridge.start({
                    source: 'can',
                    sourceName: cans[1],
                    ...bridgeTargetOptions,
                })
            )

            // Client 3
            const file3 = files.temporary()
            await files.createFile(file3)
            const logger3 = stopper.add(
                await actions.bridge.start({
                    source: 'can',
                    sourceName: cans[2],
                    target: 'file',
                    targetFile: file3,
                })
            )
            const bridge3 = stopper.add(
                await actions.bridge.start({
                    source: 'can',
                    sourceName: cans[2],
                    ...bridgeTargetOptions,
                })
            )

            // Sender
            const sender = stopper.add(
                await actions.bridge.start({
                    source: 'console',
                    sourceId: String(message.id),
                    sourceData: message.data.map(String),
                    sourceExt: message.ext,
                    sourceRtr: message.rtr,
                    target: 'can',
                    targetName: cans[0],
                })
            )

            std.log('waiting for message being bridged')
            await utils.sleep(500)

            std.log({expected: message.toString()})

            const result1 = files.loadFile(file1).trim()
            std.log({result1})
            expect(result1).to.equal(message.toString())

            const result2 = files.loadFile(file2).trim()
            std.log({result2})
            expect(result2).to.equal(message.toString())

            const result3 = files.loadFile(file3).trim()
            std.log({result3})
            expect(result3).to.equal(message.toString())

            await files.deleteFile(file1)

            await files.deleteFile(file2)

            await files.deleteFile(file3)
        })

        afterEach(async () => {
            for (const can of cans) {
                await hae.try(async () => {
                    await actions.vcan.stop({name: can})
                }, `problem when stopping vcan "${can}"`)
            }
        })
    })
}
