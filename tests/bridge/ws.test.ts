import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

describe('bridge', () => {
    createBidirectionalBridgeTest(
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
