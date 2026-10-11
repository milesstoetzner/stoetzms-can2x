import {CANMessage, ChannelOptions, RawChannel} from '#utils/socketcan'

/**
 * In-memory replacement for socketcan, used to run the tests without SocketCAN, e.g., on macOS.
 *
 * Interfaces are created on demand. Like CAN_RAW with its defaults (loopback on, recv_own_msgs off),
 * a frame sent on a channel is delivered asynchronously to every other started channel on the same interface.
 * Channels created with timestamps receive the time of delivery, like the kernel's receive time.
 */
const interfaces = new Map<string, Set<FakeRawChannel>>()

class FakeRawChannel implements RawChannel {
    private readonly name: string
    private readonly options: ChannelOptions
    private readonly listeners: ((message: CANMessage) => void)[] = []
    private started = false

    constructor(name: string, options: ChannelOptions) {
        this.name = name
        this.options = options
    }

    addListener(event: 'onMessage', callback: (message: CANMessage) => void) {
        this.listeners.push(callback)
    }

    start() {
        this.started = true
        if (!interfaces.has(this.name)) interfaces.set(this.name, new Set())
        interfaces.get(this.name)!.add(this)
    }

    stop() {
        if (!this.started) throw new Error('Channel not started')
        this.started = false
        interfaces.get(this.name)?.delete(this)
    }

    send(message: CANMessage) {
        if (!this.started) throw new Error('Channel not started')
        if (message.data.length > 8) throw new Error('Data of CAN message is longer than 8 bytes')

        for (const channel of interfaces.get(this.name) ?? []) {
            if (channel === this) continue
            const copy = {id: message.id, data: Buffer.from(message.data), ext: message.ext, rtr: message.rtr}
            setImmediate(() => channel.receive(copy))
        }
    }

    private receive(message: CANMessage) {
        if (!this.started) return
        if (this.options.timestamps) {
            const now = Date.now()
            message = {...message, ts_sec: Math.floor(now / 1000), ts_usec: (now % 1000) * 1000}
        }
        this.listeners.forEach(listener => listener(message))
    }
}

export function createRawChannelWithOptions(channel: string, options: ChannelOptions): RawChannel {
    return new FakeRawChannel(channel, options)
}
