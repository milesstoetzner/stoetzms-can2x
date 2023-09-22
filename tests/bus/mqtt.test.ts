import {createBusTest} from './utils'

// TODO: mqtt returns to original sender ...
describe.skip('mqtt-bus', () => {
    createBusTest(
        'mqtt',
        {bus: 'mqtt'},
        {
            target: 'mqtt',
            targetEndpoint: 'mqtt://localhost:3000',
        }
    )
})
