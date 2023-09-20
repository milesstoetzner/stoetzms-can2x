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
    sourceFile?: string
    target?: string
    targetEndpoint?: string
    targetEvent?: string
    targetTopic?: string
    targetName?: string
    targetFile?: string
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
            bidirectional: true, // TODO: implement, docs
        })

    if (options.source === 'console') {
        assert.isDefined(options.sourceId, '--source-id undefined')
        assert.isDefined(options.sourceData, '--source-data undefined')
        assert.isArray(options.sourceData, '--source-data must be an array')
        return new ConsoleSource({
            id: Number(options.sourceId),
            data: options.sourceData.map(Number),
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
        })

    if (options.source === 'socketio')
        return new SocketIOSource({
            port: options.sourcePort ? Number(options.sourcePort) : 3000,
            host: options.sourceHost ?? 'localhost',
            event: options.sourceEvent ?? 'can2x',
            bidirectional: true, // TODO: implement, docs
        })

    if (options.source === 'ws')
        return new WSSource({
            port: options.sourcePort ? Number(options.sourcePort) : 3000,
            host: options.sourceHost ?? 'localhost',
        })

    throw new Error(`Source of type "${options.source}" unknown`)
}

function createTarget(options: BridgeOptions) {
    if (options.target === 'can')
        return new CANTarget({
            name: options.targetName ?? 'can2x',
            bidirectional: true, // TODO: implement, docs
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
        })
    }

    if (options.target === 'socketio') {
        assert.isDefined(options.targetEndpoint, '--target-endpoint must be defined')
        return new SocketIOTarget({
            endpoint: options.targetEndpoint,
            event: options.targetEvent ?? 'can2x',
            bidirectional: true, // TODO: implement, docs
        })
    }

    if (options.target === 'ws') {
        assert.isDefined(options.targetEndpoint, '--target-endpoint must be defined')
        return new WSTarget({
            endpoint: options.targetEndpoint,
        })
    }

    throw new Error(`Target of type "${options.target}" unknown`)
}
