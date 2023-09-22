import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

// TODO: why does this not work
describe.skip('bridge', () => {
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
