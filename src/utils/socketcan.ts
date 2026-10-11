/**
 * Types of the parts of socketcan we use.
 * They are declared here since socketcan is an optional dependency which is only installed on Linux.
 */
export type CANMessage = {
    id: number
    ext: boolean
    rtr: boolean
    data: Buffer
}

export type RawChannel = {
    addListener(event: 'onMessage', callback: (message: CANMessage) => void): void
    start(): void
    stop(): void
    send(message: CANMessage): void
}

export type ChannelOptions = {
    timestamps?: boolean
    protocol?: number
    non_block_send?: boolean
}

export type SocketCAN = {
    createRawChannelWithOptions(channel: string, options: ChannelOptions): RawChannel
}

/**
 * Loads socketcan on demand, since its native module is only available on Linux.
 * This allows bridges and busses which do not use CAN to run on other platforms.
 */
export function load(): SocketCAN {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('socketcan')
    } catch (error) {
        throw new Error(`Could not load socketcan, which requires Linux with SocketCAN: ${error.message}`)
    }
}
