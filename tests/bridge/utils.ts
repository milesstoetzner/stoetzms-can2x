import {BridgeSourceOptions, BridgeTargetOptions} from '#/actions/start-bridge'
import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import hae from '#utils/hae'
import {expect} from 'chai'
import {afterEach} from 'mocha'

export function createBridgeTest(
    name: string,
    bridgeSourceOptions: BridgeSourceOptions,
    bridgeTargetOptions: BridgeTargetOptions
) {
    return describe(name, () => {
        beforeEach(async () => {
            await hae.try(async () => {
                await actions.vcan.start({})
            }, `problem when creating vcan`)
        })

        it(name, async () => {
            const message = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})
            const output = files.temporary()

            // Start can source with file target
            const receiver = await actions.bridge.start({
                ...bridgeSourceOptions,
                target: 'file',
                targetFile: output,
            })

            // Send message using console source and can target
            const sender = await actions.bridge.start({
                source: 'console',
                sourceId: String(message.id),
                sourceData: message.data.map(String),
                sourceExt: message.ext,
                sourceRtr: message.rtr,
                ...bridgeTargetOptions,
            })

            std.log('waiting for message being bridged')
            await utils.sleep(25)

            const result = files.loadFile(output).trim()
            std.log({result: result})
            std.log({expected: message.toString()})
            expect(result).to.equal(message.toString())

            await files.deleteFile(output)
            await sender.stop()
            await receiver.stop()
        })

        afterEach(async () => {
            await hae.try(async () => {
                await actions.vcan.stop({})
            }, `problem when stopping vcan`)
        })
    })
}
