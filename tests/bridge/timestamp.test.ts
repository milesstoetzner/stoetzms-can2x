import actions from '#actions'
import Message from '#core/message'
import * as files from '#files'
import * as utils from '#utils'
import hae from '#utils/hae'
import * as socketcan from '#utils/socketcan'
import {expect} from 'chai'
import {afterEach} from 'mocha'
import {Stopper} from '../stopper'

/**
 * sender --(can2xTs)--> can source -> ws target -> ws source -> file target
 */
describe('timestamp', () => {
    const stopper = new Stopper()
    const name = 'can2xTs'

    afterEach(async () => await stopper.stop())

    beforeEach(async () => {
        await hae.try(async () => {
            await actions.vcan.start({name})
        }, `problem when creating vcan "${name}"`)
    })

    it('keeps the time at which a message has been received from can', async () => {
        const output = files.temporary()
        await files.createFile(output)

        stopper.add(await actions.bridge.start({source: 'ws', sourcePort: '3024', target: 'file', targetFile: output}))
        stopper.add(
            await actions.bridge.start({
                source: 'can',
                sourceName: name,
                target: 'ws',
                targetEndpoint: 'ws://localhost:3024',
            })
        )

        const sender = socketcan.load().createRawChannelWithOptions(name, {non_block_send: true})
        sender.start()
        stopper.add(sender)

        const before = Date.now() * 1000
        sender.send(Message.fromJSON({id: 1, data: [1], ext: false, rtr: false}).toCAN())
        await utils.sleep(500)
        const after = Date.now() * 1000

        const lines = files.loadFile(output).trim().split('\n')
        expect(lines).to.have.length(1)
        const {timestamp} = JSON.parse(lines[0])
        expect(timestamp).to.be.within(before, after)

        await files.deleteFile(output)
    })

    afterEach(async () => {
        await hae.try(async () => {
            await actions.vcan.stop({name})
        }, `problem when stopping vcan "${name}"`)
    })
})
