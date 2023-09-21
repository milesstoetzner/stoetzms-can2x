import {startBus} from '#/actions/start-bus'
import {startVCAN} from '#/actions/start-vcan'
import {stopVCAN} from '#/actions/stop-vcan'
import {startBridge} from './start-bridge'

export default {
    bridge: {
        start: startBridge,
    },
    bus: {
        start: startBus,
    },
    vcan: {
        start: startVCAN,
        stop: stopVCAN,
    },
}
