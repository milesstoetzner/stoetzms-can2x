import console from 'console'
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
        } catch (e) {
            console.log(e)
            process.exit(1)
        }
    }
}

function log<T>(fn: (args: T) => Promise<void>): (args: T) => Promise<void> {
    return async (args: T) => {
        try {
            await fn(args)
        } catch (e) {
            console.log(e)
        }
    }
}

export default {
    express,
    exit,
    log,
}
