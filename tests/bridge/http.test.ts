import {createBridgeTest} from './utils'

describe('bridge', () => {
    createBridgeTest(
        'http',
        {source: 'http', sourcePort: '3000'},
        {
            target: 'http',
            targetEndpoint: 'http://localhost:3000',
        }
    )
})
