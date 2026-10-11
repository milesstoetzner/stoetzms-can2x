import actions from '#actions'
import Message from '#core/message'
import * as utils from '#utils'
import hae from '#utils/hae'
import * as socketcan from '#utils/socketcan'
import {expect} from 'chai'
import {afterEach} from 'mocha'
import {Stopper} from '../stopper'

/**
 * sender --(oa<transport>)--> can source -> <transport> target -> <transport> source -> can target --(ob<transport>)--> receiver
 */
const transports = [
    {transport: 'http', port: 3020, endpoint: 'http://localhost:3020'},
    {transport: 'mqtt', port: 3021, endpoint: 'mqtt://localhost:3021'},
    {transport: 'socketio', port: 3022, endpoint: 'http://localhost:3022'},
    {transport: 'ws', port: 3023, endpoint: 'ws://localhost:3023'},
]

const count = 200

describe('order', () => {
    const stopper = new Stopper()

    afterEach(async () => await stopper.stop())

    for (const {transport, port, endpoint} of transports) {
        const cans = [`oa${transport}`, `ob${transport}`]

        describe(transport, () => {
            beforeEach(async () => {
                for (const can of cans) {
                    await hae.try(async () => {
                        await actions.vcan.start({name: can})
                    }, `problem when creating vcan "${can}"`)
                }
            })

            it(`keeps the order of ${count} messages sent at once`, async () => {
                stopper.add(
                    await actions.bridge.start({
                        source: transport,
                        sourcePort: String(port),
                        target: 'can',
                        targetName: cans[1],
                    })
                )
                stopper.add(
                    await actions.bridge.start({
                        source: 'can',
                        sourceName: cans[0],
                        target: transport,
                        targetEndpoint: endpoint,
                    })
                )

                const can = socketcan.load()
                const ids: number[] = []
                const receiver = can.createRawChannelWithOptions(cans[1], {non_block_send: true})
                receiver.addListener('onMessage', message => ids.push(message.id))
                receiver.start()
                stopper.add(receiver)

                const sender = can.createRawChannelWithOptions(cans[0], {non_block_send: true})
                sender.start()
                stopper.add(sender)

                const expected = Array.from({length: count}, (_, i) => i)
                for (const id of expected) sender.send(Message.fromJSON({id, data: [], ext: false, rtr: false}).toCAN())

                for (let i = 0; i < 50 && ids.length < count; i++) await utils.sleep(100)
                expect(ids).to.deep.equal(expected)
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
})
