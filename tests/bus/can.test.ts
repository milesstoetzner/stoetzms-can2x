import {createBusTest} from './utils'

describe('bus', () => {
    createBusTest(
        'can',
        {bus: 'can', name: 'can2x0'},
        {
            target: 'can',
            targetName: 'can2x0',
        }
    )
})
