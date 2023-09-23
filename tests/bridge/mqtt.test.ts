import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

describe('bridge', () => {
    createBidirectionalBridgeTest(
        'mqtt',
        {
            source: 'mqtt',
            sourcePort: '3001',
        },
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3001',
        }
    )
})

describe('bridge', () => {
    createBridgeTest(
        'mqtt',
        {
            source: 'mqtt',
            sourcePort: '3002',
        },
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3002',
        }
    )
})
