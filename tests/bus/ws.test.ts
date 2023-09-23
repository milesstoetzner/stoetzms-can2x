import {createBusTest} from './utils'

describe('bus', () => {
    createBusTest(
        'ws',
        {bus: 'ws', port: '3009'},
        {
            target: 'ws',
            targetEndpoint: 'ws://localhost:3009',
        }
    )
})
