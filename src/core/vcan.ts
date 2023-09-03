import std from '#std'

export type VCANOptions = {
    name?: string
}

import * as execa from 'execa'

export class VCAN {
    options: Required<VCANOptions>

    constructor(options?: VCANOptions) {
        this.options = {name: options?.name ?? 'vcan0'}
    }

    async check() {
        await execa.command(`modprobe vcan`)
    }

    async start() {
        std.log('starting vcan', {options: this.options})
        await this.check()
        await execa.command(`ip link add ${this.options.name} type vcan`)
        await execa.command(`ip link set ${this.options.name} up`)
        std.log('vcan started')
    }

    async stop() {
        std.log('stopping vcan')
        await execa.command(`ip link set ${this.options.name} down`)
        await execa.command(`ip link delete ${this.options.name}`)
        std.log('vcan stopped')
    }
}
