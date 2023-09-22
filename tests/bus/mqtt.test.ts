import {createBusTest} from './utils'

// TODO: mqtt returns to original sender ...
describe.skip('bus', () => {
    createBusTest(
        'mqtt',
        {bus: 'mqtt'},
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3000',
        }
    )
})
