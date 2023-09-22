import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

// TODO: make this work
// The logger claims to have written 69 into output file but at the end only 42 is present
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
