import {createBusTest} from './utils'

// TODO: Uncaught ReferenceError: WebSocket is not defined
describe.skip('bus', () => {
    createBusTest(
        'ws',
        {bus: 'ws'},
        {
            target: 'ws',
            targetEndpoint: 'ws://localhost:3000',
        }
    )
})
