import {createBusTest} from './utils'

describe('bus', () => {
    createBusTest(
        'socketio',
        {bus: 'socketio'},
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3000',
        }
    )
})
