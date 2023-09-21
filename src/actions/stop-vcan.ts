import {VCAN, VCANOptions} from '#core/vcan'
import std from '#std'

export async function stopVCAN(options: VCANOptions) {
    std.log('can2x vcan delete', {options})

    std.log('deleting vcan')
    const vcan = new VCAN(options)
    await vcan.stop()
    return vcan
}
