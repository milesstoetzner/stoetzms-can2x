import {createBridgeTest} from './utils'

describe('bridge', () => {
    createBridgeTest(
        'websocket',
        {
            source: 'ws',
        },
        {
            target: 'ws',
            targetEndpoint: 'ws://localhost:3000',
        }
    )
})
