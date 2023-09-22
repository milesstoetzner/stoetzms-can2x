import {createBridgeTest} from './utils'

describe('bridge', () => {
    createBridgeTest(
        'http',
        {source: 'http'},
        {
            target: 'http',
            targetEndpoint: 'http://localhost:3000',
        }
    )
})
