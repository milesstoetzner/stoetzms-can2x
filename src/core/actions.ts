import {Bridge} from '#/core/bridge'
import {VCAN, VCANOptions} from '#/core/vcan'
import {CanReceiver} from '#/receiver/can'
import {ConsoleReceiver} from '#/receiver/console'
import {HTTPReceiver} from '#/receiver/http'
import {SocketIOReceiver} from '#/receiver/socket-io'
import {WSReceiver} from '#/receiver/ws'
import {ConsoleSender} from '#/sender/console'
import {FileSender} from '#/sender/file'
import {HTTPSender} from '#/sender/http'
import {SocketIOSender} from '#/sender/socket-io'
import {WSSender} from '#/sender/ws'
import * as assert from '#assert'
import std from '#std'

export type BridgeOptions = {
    receiver?: string
    receiverPort?: string
    receiverHost?: string
    receiverEvent?: string
    receiverId?: string
    receiverData?: string[]
    sender?: string
    senderEndpoint?: string
    senderEvent?: string
    senderFile?: string
}

export async function createBridge(options: BridgeOptions) {
    std.log('can2x bridge', {options})

    const receiver = createReceiver(options)
    const sender = createSender(options)
    const bridge = new Bridge(receiver, sender)

    std.log('starting bridge')
    await bridge.start()
    return bridge
}

export async function startVCAN(options: VCANOptions) {
    std.log('can2x vcan create', {options})

    std.log('creating vcan')
    const vcan = new VCAN(options)
    await vcan.start()
    return vcan
}

export async function stopVCAN(options: VCANOptions) {
    std.log('can2x vcan delete', {options})

    std.log('deleting vcan')
    const vcan = new VCAN(options)
    await vcan.stop()
    return vcan
}

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
            port: options.receiverPort ? Number(options.receiverPort) : 3000,
            host: options.receiverHost ?? 'localhost',
        })

    if (options.receiver === 'socket-io') {
        return new SocketIOReceiver({
            port: options.receiverPort ? Number(options.receiverPort) : 3000,
            host: options.receiverHost ?? 'localhost',
            event: options.receiverEvent ?? 'can2x',
        })
    }

    if (options.receiver === 'ws') {
        return new WSReceiver({
            port: options.receiverPort ? Number(options.receiverPort) : 3000,
            host: options.receiverHost ?? 'localhost',
        })
    }

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

    if (options.sender === 'file') {
        assert.isString(options.senderFile)
        return new FileSender({
            file: options.senderFile,
        })
    }

    if (options.sender === 'socket-io') {
        assert.isDefined(options.senderEndpoint, '--sender-endpoint must be defined')

        return new SocketIOSender({
            endpoint: options.senderEndpoint,
            event: options.senderEvent ?? 'can2x',
        })
    }

    if (options.sender === 'ws') {
        assert.isDefined(options.senderEndpoint, '--sender-endpoint must be defined')
        return new WSSender({
            endpoint: options.senderEndpoint,
        })
    }

    throw new Error(`Sender of type "${options.sender}" unknown`)
}
