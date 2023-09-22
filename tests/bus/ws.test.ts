import {createBusTest} from './utils'

// TODO: message seems not to be published
describe.skip('ws-bus', () => {
    createBusTest(
        'ws',
        {bus: 'ws'},
        {
            target: 'ws',
            targetEndpoint: 'ws://localhost:3000',
        }
    )
})
