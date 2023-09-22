import {createBusTest} from './utils'

describe('socketio-bus', () => {
    createBusTest(
        'socketio',
        {bus: 'socketio'},
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3000',
        }
    )
})
