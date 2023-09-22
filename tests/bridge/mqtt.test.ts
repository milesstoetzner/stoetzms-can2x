import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

// TODO: why does this not work
describe.skip('bridge', () => {
    createBidirectionalBridgeTest(
        'mqtt',
        {
            source: 'mqtt',
        },
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3000',
        }
    )
})

describe('bridge', () => {
    createBridgeTest(
        'mqtt',
        {
            source: 'mqtt',
        },
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3000',
        }
    )
})
