import {VCAN} from '#core/vcan'
import std from '#std'

export async function checkVCAN() {
    std.log('can2x vcan check')
    await VCAN.check()
    std.log('vcan check succeeded')
}
