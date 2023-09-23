import {createBusTest} from './utils'

describe('bus', () => {
    createBusTest(
        'mqtt',
        {bus: 'mqtt', port: '3007'},
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3007',
        }
    )
})
