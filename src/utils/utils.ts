import * as assert from '#assert'

export function pretty(obj: any) {
    return JSON.stringify(obj, null, 4)
}

export function stringify(obj: any) {
    return JSON.stringify(obj)
}

export async function sleep(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function createDecomposedPromise() {
    let _resolve: (value: void | PromiseLike<void>) => void
    let _reject: (reason?: any) => void

    const _promise = new Promise<void>((resolve, reject) => {
        _resolve = resolve
        _reject = reject
    })

    // @ts-ignore
    assert.isDefined(_resolve, '_resolve not defined')

    // @ts-ignore
    assert.isDefined(_reject, '_resolve not defined')

    return {
        promise: _promise,
        resolve: _resolve,
        reject: _reject,
    }
}
