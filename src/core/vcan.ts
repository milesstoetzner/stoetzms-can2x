export type VCANOptions = {
    name?: string
}

// TODO: what is about sudo

export class VCAN {
    options: Required<VCANOptions>

    constructor(options?: VCANOptions) {
        this.options = {name: options?.name ?? 'vcan0'}
    }

    async check() {
        await shell(`modprobe vcan`)
    }

    async start() {
        await this.check()
        await shell(`ip link add ${this.options.name} type vcan`)
        await shell(`ip link set ${this.options.name} up`)
    }

    async stop() {
        await shell(`ip link set ${this.options.name} down`)
        await shell(`ip link delete ${this.options.name}`)
    }
}

async function shell(command: string) {
    const result = await (await import('execa')).$`${command}`
    if (result.failed) throw new Error(`Command "${command}} failed`)
}
