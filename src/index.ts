import {Bridge} from '#/bridge'
import {CanReceiver} from '#/receiver/can'
import {ConsoleReceiver} from '#/receiver/console'
import {HTTPReceiver} from '#/receiver/http'
import {ConsoleSender} from '#/sender/console'
import {HTTPSender} from '#/sender/http'
import {VCAN, VCANOptions} from '#/vcan'
import * as assert from '#assert'
import std from '#std'
import hae from '#utils/hae'
import {Command} from 'commander'

export const program = new Command()

type BridgeOptions = {
    receiver: string
    receiverPort: string
    receiverHost: string
    receiverId?: string
    receiverData?: string[]
    sender: string
    senderEndpoint?: string
}

const can2x = program.name('can2x')

const bridge = program
    .command('bridge')
    .option('--receiver [string]', '', 'can')
    .option('--receiver-port [string]', '', '4269')
    .option('--receiver-host [string]', '', 'localhost')
    .option('--receiver-id [number]', '')
    .option('--receiver-data [numbers...]', '')
    .option('--sender [string]', '', 'console')
    .option('--sender-endpoint [string]', '')
    .action(
        hae.exit(async (options: BridgeOptions) => {
            std.log('can2x bridge', {options})

            const receiver = createReceiver(options)
            const sender = createSender(options)
            const bridge = new Bridge(receiver, sender)

            await bridge.start()
        })
    )

const vcan = program
    .command('vcan')
    .option('--name', '', 'vcan0')
    .action(
        hae.exit(async (options: VCANOptions) => {
            std.log('can2x vcan', {options})

            const vcan = new VCAN(options)
            await vcan.create()
        })
    )

program.parse()

function createReceiver(options: BridgeOptions) {
    if (options.receiver === 'can') return new CanReceiver()

    if (options.receiver === 'console') {
        assert.isDefined(options.receiverId, '--receiver-id undefined')
        assert.isDefined(options.receiverData, '--receiver-data undefined')
        assert.isArray(options.receiverData, '--receiver-data must be an array')
        return new ConsoleReceiver({
            id: Number(options.receiverId),
            data: options.receiverData.map(Number),
        })
    }

    if (options.receiver === 'http')
        return new HTTPReceiver({
            port: options.receiverPort ? Number(options.receiverPort) : 4269,
            host: options.receiverHost ?? 'localhost',
        })

    throw new Error(`Receiver of type "${options.receiver}" unknown`)
}

function createSender(options: BridgeOptions) {
    if (options.sender === 'console') return new ConsoleSender()

    if (options.sender === 'http') {
        assert.isString(options.senderEndpoint)
        return new HTTPSender({
            endpoint: options.senderEndpoint,
        })
    }

    throw new Error(`Sender of type "${options.sender}" unknown`)
}
