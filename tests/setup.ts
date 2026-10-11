import {VCAN} from '#core/vcan'
import std from '#std'
import Module from 'module'
import * as path from 'path'

/**
 * Replaces socketcan and vcan management with in-memory fakes when SocketCAN is not available.
 * This is the case on platforms other than Linux, or can be forced with CAN2X_FAKE_CAN=true.
 */
if (process.platform !== 'linux' || process.env.CAN2X_FAKE_CAN === 'true') {
    std.log('using fake socketcan and vcan')

    const fake = path.join(__dirname, 'fake', 'socketcan')
    const resolve = (Module as any)._resolveFilename
    ;(Module as any)._resolveFilename = function (request: string, ...args: unknown[]) {
        return resolve.call(this, request === 'socketcan' ? fake : request, ...args)
    }

    const noop = async () => std.log('skipping vcan management')
    VCAN.check = noop
    VCAN.prototype.start = noop
    VCAN.prototype.stop = noop
}
