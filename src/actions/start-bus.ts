import {CANBus} from '#/bus/can'
import {MQTTBus} from '#/bus/mqtt'
import {SocketIOBus} from '#/bus/socketio'
import WSBus from '#/bus/ws'
import std from '#std'

export type BusOptions = {
    bus?: string
    port?: string
    host?: string
    event?: string
    name?: string
    topic?: string
}

export async function startBus(options: BusOptions) {
    std.log('can2x bus', {options})

    const bus = createBus(options)

    std.log('starting bus')
    await bus.start()
    await bus.ready()
    return bus
}

function createBus(options: BusOptions) {
    if (options.bus === 'can')
        return new CANBus({
            name: options.name ?? 'can2x',
        })

    if (options.bus === 'socketio')
        return new SocketIOBus({
            port: options.port ? Number(options.port) : 3000,
            host: options.host ?? 'localhost',
            event: options.event ?? 'can2x',
        })

    if (options.bus === 'ws')
        return new WSBus({
            port: options.port ? Number(options.port) : 3000,
            host: options.host ?? 'localhost',
        })

    if (options.bus === 'mqtt')
        return new MQTTBus({
            port: options.port ? Number(options.port) : 3000,
            host: options.host ?? 'localhost',
            topic: options.topic ?? 'can2x',
        })

    throw new Error(`Bus of type "${options.bus}" unknown`)
}
