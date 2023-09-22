import {createBridgeTest} from './utils'

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
