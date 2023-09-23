import {createBusTest} from './utils'

// TODO: mqtt returns to original sender ...
describe.skip('bus', () => {
    createBusTest(
        'mqtt',
        {bus: 'mqtt', port: '3007'},
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3007',
        }
    )
})
