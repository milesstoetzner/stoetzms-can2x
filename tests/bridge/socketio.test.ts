import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

// TODO: make this work
describe.skip('bridge', () => {
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
