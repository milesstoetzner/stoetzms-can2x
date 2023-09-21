import {VCAN, VCANOptions} from '#core/vcan'
import std from '#std'

export async function startVCAN(options: VCANOptions) {
    std.log('can2x vcan create', {options})

    std.log('creating vcan')
    const vcan = new VCAN(options)
    await vcan.start()
    return vcan
}
