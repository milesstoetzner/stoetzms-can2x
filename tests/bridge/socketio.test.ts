import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

describe('bridge', () => {
    createBidirectionalBridgeTest(
        'socketio',
        {
            source: 'socketio',
            sourcePort: '3003',
        },
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3003',
        }
    )
})

describe('bridge', () => {
    createBridgeTest(
        'socketio',
        {
            source: 'socketio',
            sourcePort: '3004',
        },
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3004',
        }
    )
})
