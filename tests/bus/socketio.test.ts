import {createBusTest} from './utils'

describe('bus', () => {
    createBusTest(
        'socketio',
        {bus: 'socketio', port: '3008'},
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3008',
        }
    )
})
