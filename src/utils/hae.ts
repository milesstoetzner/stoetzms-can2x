import std from '#std'
import Express from 'express'

function express(fn: Express.RequestHandler): Express.RequestHandler {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

function exit<T>(fn: (args: T) => Promise<void>): (args: T) => Promise<void> {
    return async (options: T) => {
        try {
            await fn(options)
        } catch (error) {
            std.log({error})
            process.exit(1)
        }
    }
}

function log<T>(fn: (args: T) => Promise<void>): (args: T) => Promise<void> {
    return async (args: T) => {
        try {
            await fn(args)
        } catch (error) {
            std.log({error})
        }
    }
}

/**
 * Wraps an event listener, so that an error, e.g., due to a malformed message, is logged instead of crashing the process.
 */
function listener<T extends unknown[]>(fn: (...args: T) => void, reason?: string): (...args: T) => void {
    return (...args: T) => {
        try {
            fn(...args)
        } catch (error) {
            std.log(reason, {error})
        }
    }
}

async function _try(fn: () => Promise<void>, reason?: string) {
    try {
        await fn()
    } catch (error) {
        std.log(reason, {error})
    }
}

export default {
    express,
    exit,
    log,
    listener,
    try: _try,
}
