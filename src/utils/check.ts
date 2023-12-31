import Message from '#core/message'

export function isTrue(element?: boolean) {
    return isDefined(element) && element === true
}

export function isFalse(element?: boolean) {
    return isDefined(element) && element === false
}

export function isUndefined(element: unknown): element is undefined | null {
    return typeof element === 'undefined' || element === null || element == null
}

export function isDefined<T>(element: T | undefined | null): element is T {
    return !isUndefined(element)
}

export function isString(element: unknown): element is string {
    return typeof element === 'string'
}

export function isBoolean(element: unknown): element is boolean {
    return typeof element === 'boolean'
}

export function isNumber(element: unknown): element is number {
    return typeof element === 'number'
}

export function isArray(element: unknown): element is Array<unknown> {
    return Array.isArray(element)
}

export function isObject(element: unknown): element is object {
    return typeof element === 'object'
}

export function isName(name: string) {
    return name.match(/^[a-z-0-9.]+$/)
}

export function isBuffer(element: unknown): element is Buffer {
    return Buffer.isBuffer(element)
}
export function isMessage(element: any): element is Message {
    return element instanceof Message
}
