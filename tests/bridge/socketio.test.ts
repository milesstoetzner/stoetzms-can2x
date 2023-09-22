import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

describe('bridge', () => {
    createBidirectionalBridgeTest(
        'socketio',
        {
            source: 'socketio',
        },
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3000',
        }
    )
})

describe('bridge', () => {
    createBridgeTest(
        'socketio',
        {
            source: 'socketio',
        },
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3000',
        }
    )
})
