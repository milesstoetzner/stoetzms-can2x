import {SocketIOBus} from '#/bus/socketio'
import {CANSource} from '#/source/can'
import {ConsoleSource} from '#/source/console'
import {FileSource} from '#/source/file'
import {HTTPSource} from '#/source/http'
import {MQTTSource} from '#/source/mqtt'
import {SocketIOSource} from '#/source/socketio'
import {WSSource} from '#/source/ws'
import {CANTarget} from '#/target/can'
import {ConsoleTarget} from '#/target/console'
import {FileTarget} from '#/target/file'
import {HTTPTarget} from '#/target/http'
import {MQTTTarget} from '#/target/mqtt'
import {SocketIOTarget} from '#/target/socketio'
import {WSTarget} from '#/target/ws'
import * as assert from '#assert'
import {Bridge} from '#core/bridge'
import {VCAN, VCANOptions} from '#core/vcan'
import std from '#std'

export type BridgeOptions = {
    source?: string
    sourcePort?: string
    sourceHost?: string
    sourceEvent?: string
    sourceTopic?: string
    sourceName?: string
    sourceId?: string
    sourceData?: string[]
    sourceExt?: boolean
    sourceRtr?: boolean
    sourceFile?: string
    sourceBidirectional?: boolean
    target?: string
    targetEndpoint?: string
    targetEvent?: string
    targetTopic?: string
    targetName?: string
    targetFile?: string
    targetBidirectional?: boolean
}

export async function startBridge(options: BridgeOptions) {
    std.log('can2x bridge', {options})

    const source = createSource(options)
    const target = createTarget(options)
    const bridge = new Bridge(source, target)

    std.log('starting bridge')
    await bridge.start()
    return bridge
}

export type BusOptions = {
    bus?: string
    port?: number
    host?: string
    event?: string
}

// TODO: actions folder with one action per file
export async function startBus(options: BusOptions) {
    std.log('can2x bus', {options})

    const bus = createBus(options)

    std.log('starting bus')
    await bus.start()
    await bus.ready()
    return bus
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

function createSource(options: BridgeOptions) {
    if (options.source === 'can')
        return new CANSource({
            name: options.sourceName ?? 'can2x',
            bidirectional: options.sourceBidirectional ?? true,
        })

    if (options.source === 'console') {
        assert.isDefined(options.sourceId, '--source-id undefined')
        assert.isDefined(options.sourceData, '--source-data undefined')
        assert.isArray(options.sourceData, '--source-data must be an array')
        return new ConsoleSource({
            id: Number(options.sourceId),
            data: options.sourceData.map(Number),
            ext: options.sourceExt ?? false,
            rtr: options.sourceRtr ?? false,
        })
    }

    if (options.source === 'file') {
        assert.isDefined(options.sourceFile, '--source-file undefined')
        return new FileSource({
            file: options.sourceFile,
        })
    }

    if (options.source === 'http')
        return new HTTPSource({
            port: options.sourcePort ? Number(options.sourcePort) : 3000,
            host: options.sourceHost ?? 'localhost',
        })

    if (options.source === 'mqtt')
        return new MQTTSource({
            port: options.sourcePort ? Number(options.sourcePort) : 3000,
            host: options.sourceHost ?? 'localhost',
            topic: options.sourceTopic ?? 'can2x',
            bidirectional: options.sourceBidirectional ?? true,
        })

    if (options.source === 'socketio')
        return new SocketIOSource({
            port: options.sourcePort ? Number(options.sourcePort) : 3000,
            host: options.sourceHost ?? 'localhost',
            event: options.sourceEvent ?? 'can2x',
            bidirectional: options.sourceBidirectional ?? true,
        })

    if (options.source === 'ws')
        return new WSSource({
            port: options.sourcePort ? Number(options.sourcePort) : 3000,
            host: options.sourceHost ?? 'localhost',
            bidirectional: options.sourceBidirectional ?? true,
        })

    throw new Error(`Source of type "${options.source}" unknown`)
}

function createTarget(options: BridgeOptions) {
    if (options.target === 'can')
        return new CANTarget({
            name: options.targetName ?? 'can2x',
            bidirectional: options.targetBidirectional ?? true,
        })

    if (options.target === 'console') return new ConsoleTarget()

    if (options.target === 'file') {
        assert.isString(options.targetFile)
        return new FileTarget({
            file: options.targetFile,
        })
    }

    if (options.target === 'http') {
        assert.isString(options.targetEndpoint)
        return new HTTPTarget({
            endpoint: options.targetEndpoint,
        })
    }

    if (options.target === 'mqtt') {
        assert.isString(options.targetEndpoint)
        return new MQTTTarget({
            endpoint: options.targetEndpoint,
            topic: options.targetTopic ?? 'can2x',
            bidirectional: options.targetBidirectional ?? true,
        })
    }

    if (options.target === 'socketio') {
        assert.isDefined(options.targetEndpoint, '--target-endpoint must be defined')
        return new SocketIOTarget({
            endpoint: options.targetEndpoint,
            event: options.targetEvent ?? 'can2x',
            bidirectional: options.targetBidirectional ?? true,
        })
    }

    if (options.target === 'ws') {
        assert.isDefined(options.targetEndpoint, '--target-endpoint must be defined')
        return new WSTarget({
            endpoint: options.targetEndpoint,
            bidirectional: options.targetBidirectional ?? true,
        })
    }

    throw new Error(`Target of type "${options.target}" unknown`)
}

function createBus(options: BusOptions) {
    if (options.bus === 'socketio')
        return new SocketIOBus({
            port: options.port ? Number(options.port) : 3000,
            host: options.host ?? 'localhost',
            event: options.event ?? 'can2x',
        })

    throw new Error(`Bus of type "${options.bus}" unknown`)
}
