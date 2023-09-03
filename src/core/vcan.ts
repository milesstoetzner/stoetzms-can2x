export type VCANOptions = {
    name?: string
}

export class VCAN {
    options: Required<VCANOptions>

    constructor(options?: VCANOptions) {
        this.options = {name: options?.name ?? 'vcan0'}
    }

    async check() {
        await shell(`modprobe vcan`)
    }

    async create() {
        await this.check()
        await shell(`ip link add ${this.options.name} type vcan`)
        await shell(`ip link set up ${this.options.name}`)
    }
}

async function shell(command: string) {
    const result = await (await import('execa')).$`${command}`
    if (result.failed) throw new Error(`Command "${command}} failed`)
}
