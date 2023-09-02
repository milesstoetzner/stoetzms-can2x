import {Bridge} from '#/bridge'
import {CanReceiver} from '#/receiver/can'
import {HTTPReceiver} from '#/receiver/http'
import {HTTPSender} from '#/sender/http'
import {LogSender} from '#/sender/log'
import {VCAN, VCANOptions} from '#/vcan'
import hae from '#utils/hae'
import {Command} from 'commander'

export const program = new Command()

type BridgeOptions = {
    receiver: string
    receiverPort: string
    receiverHost: string
    sender: string
    senderEndpoint: string
}

const can2x = program.name('can2x')

const bridge = program
    .command('bridge')
    .option('--receiver [string]', '', 'can')
    .option('--receiver-port [string]', '', '4269')
    .option('--receiver-host [string]', '', 'localhost')
    .option('--sender [string]', '', 'log')
    .option('--sender-endpoint [string]', '')
    .action(
        hae.exit(async (options: BridgeOptions) => {
            console.log({options})

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
            const vcan = new VCAN(options)
            await vcan.create()
        })
    )

program.parse()

function createReceiver(options: BridgeOptions) {
    if (options.receiver === 'can') return new CanReceiver()

    if (options.receiver === 'http')
        return new HTTPReceiver({
            port: options.receiverPort ? Number(options.receiverPort) : undefined,
            host: options.receiverHost,
        })

    throw new Error(`Receiver of type "${options.receiver}" unknown`)
}

function createSender(options: BridgeOptions) {
    if (options.sender === 'log') return new LogSender()

    if (options.sender === 'http')
        return new HTTPSender({
            endpoint: options.senderEndpoint,
        })

    throw new Error(`Sender of type "${options.sender}" unknown`)
}
