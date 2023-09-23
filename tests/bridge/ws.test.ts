import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

describe('bridge', () => {
    createBidirectionalBridgeTest(
        'websocket',
        {
            source: 'ws',
            sourcePort: '3005',
        },
        {
            target: 'ws',
            targetEndpoint: 'ws://localhost:3005',
        }
    )
})

describe('bridge', () => {
    createBridgeTest(
        'websocket',
        {
            source: 'ws',
            sourcePort: '3006',
        },
        {
            target: 'ws',
            targetEndpoint: 'ws://localhost:3006',
        }
    )
})
