import {createBidirectionalBridgeTest, createBridgeTest} from './utils'

describe('bridge', () => {
    createBidirectionalBridgeTest(
        'can',
        {source: 'can', sourceName: 'can2xBridge'},
        {target: 'can', targetName: 'can2xBridge'}
    )
})

describe('bridge', () => {
    createBridgeTest('can', {source: 'can'}, {target: 'can'})
})
