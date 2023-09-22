import {createBridgeTest} from './utils'

describe('bridge', () => {
    createBridgeTest(
        'socketio',
        {
            source: 'socketio',
        },
        {
            target: 'socketio',
            targetEndpoint: 'http://localhost:3000',
        }
    )
})
