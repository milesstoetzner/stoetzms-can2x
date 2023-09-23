import {BridgeSourceOptions, BridgeTargetOptions} from '#/actions/start-bridge'
import actions from '#actions'
import Message, {CANMessage} from '#core/message'
import * as files from '#files'
import std from '#std'
import * as utils from '#utils'
import hae from '#utils/hae'
import {expect} from 'chai'
import {afterEach} from 'mocha'
import * as can from 'socketcan'

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
            const bridge = await actions.bridge.start({
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
            const expected = message.toString()
            std.log({result, expected})
            expect(result).to.equal(expected)

            await files.deleteFile(output)
            await sender.stop()
            await bridge.stop()
        })

        afterEach(async () => {
            await hae.try(async () => {
                await actions.vcan.stop({})
            }, `problem when stopping vcan`)
        })
    })
}

/**
 * sender --(can2xSender)--> source <----> target <--(can2xReceiver)--> receiver
 * logger <------┘
 */
export function createBidirectionalBridgeTest(
    name: string,
    bridgeSourceOptions: BridgeSourceOptions,
    bridgeTargetOptions: BridgeTargetOptions
) {
    return describe(name, () => {
        const cans = ['can2xSender', 'can2xReceiver', 'can2xBridge']

        beforeEach(async () => {
            for (const can of cans) {
                await hae.try(async () => {
                    await actions.vcan.start({name: can})
                }, `problem when creating vcan "${can}"`)
            }
        })

        it(name, async () => {
            const request = Message.fromJSON({id: 69, data: [1, 2, 3], ext: false, rtr: false})
            const response = Message.fromJSON({id: 42, data: [4, 5, 6], ext: false, rtr: false})
            const output = files.temporary()

            // Receives "request" and returns "answer"
            const receiver = can.createRawChannel(cans[1])
            receiver.addListener('onMessage', function (message: CANMessage) {
                std.log('receiver received', {message})

                std.log('ensuring that received message is request')
                expect(Message.fromCAN(message).toString(), 'received message is not request').to.equal(
                    request.toString()
                )
                std.log('received message is request')

                std.log('ensuring that already logged message is request')
                expect(files.loadFile(output).trim(), 'already logged message is not request').to.equal(
                    request.toString()
                )
                std.log('already logged message is request')

                std.log('receiver sending message', {message: response, options: {name: cans[1]}})
                receiver.send(response.toCAN())
            })
            receiver.start()

            const target = await actions.bridge.start({
                ...bridgeSourceOptions,
                target: 'can',
                targetName: cans[1],
            })

            const source = await actions.bridge.start({
                source: 'can',
                sourceName: cans[0],
                ...bridgeTargetOptions,
            })

            // Send message using console source and can target
            const logger = await actions.bridge.start({
                source: 'can',
                sourceName: cans[0],
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
                targetName: cans[0],
            })

            std.log('waiting for message being bridged')
            await utils.sleep(250)

            const result = files.loadFile(output).trim().split('\n')
            const expected = [request.toString(), response.toString()]
            std.log({result, expected})
            expect(result, 'result not as expected').to.deep.equal(expected)

            await files.deleteFile(output)
            await sender.stop()
            await logger.stop()
            await source.stop()
            await target.stop()
            receiver.stop()
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
