import * as check from '#check'
import Message from '#core/message'
import * as utils from '#utils'

export function isDefined<T>(element: T | undefined | null, msg: string): asserts element is T {
    if (!check.isDefined(element)) throw new Error(msg)
}

export function isUndefined<T>(element: T | undefined | null, msg: string): asserts element is undefined | null {
    if (!check.isUndefined(element)) throw new Error(msg)
}

export function isString(element: unknown): asserts element is string {
    if (!check.isString(element)) throw new Error(`Element "${utils.stringify(element)}" is not a string`)
}

export function isStringOrNumber(element: unknown): asserts element is string | number {
    if (!check.isString(element) && !check.isNumber(element))
        throw new Error(`Element "${utils.stringify(element)}" is neither a string nor a number`)
}

export function isBoolean(element: unknown): asserts element is boolean {
    if (!check.isBoolean(element)) throw new Error(`Element "${utils.stringify(element)}" is not a boolean`)
}

export function isStatement(boolean: boolean, msg: string) {
    if (!boolean) throw new Error(msg)
}

export function isNumber(element: unknown): asserts element is number {
    if (!check.isNumber(element)) throw new Error(`Element "${utils.stringify(element)}" is not a number`)
}

export function isNumbers(element: unknown): asserts element is number[] {
    isArray(element)
    element.forEach(isNumber)
}

export function isArray(element: unknown, msg?: string): asserts element is Array<unknown> {
    if (!check.isArray(element)) throw new Error(msg ?? `Element "${utils.stringify(element)}" is not an array`)
}

export function isObject(element: unknown): asserts element is object {
    if (!check.isObject(element)) throw new Error(`Element "${utils.stringify(element)}" is not an object`)
}

export function isName(name: string) {
    if (!check.isName(name))
        throw new Error(`Name "${name}" not allowed. Only small characters, numbers, hyphens, and dots are allowed.`)
}

export function isBuffer(element: unknown): asserts element is Buffer {
    if (!check.isBuffer(element)) throw new Error(`Element "${element} is not a buffer`)
}

export function isMessage(element: any): asserts element is Message {
    if (!check.isMessage(element)) throw new Error(`Object "${element}" is not a message"`)
}
