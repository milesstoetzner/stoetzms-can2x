import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

// TODO: mqtt returns to original sender ... (similar but not same bug as at mqtt bus)
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
