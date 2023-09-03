import {Receiver} from '#/receiver/receiver'
import {Message} from '#/types'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
import bodyParser from 'body-parser'
import cors from 'cors'
import type {ErrorRequestHandler} from 'express'
import express, {Request} from 'express'
import http from 'http'
import createError from 'http-errors'

export type HTTPReceiverOptions = {
    port: number
    host: string
}

export class HTTPReceiver extends Receiver {
    server?: http.Server
    options: HTTPReceiverOptions

    constructor(options: HTTPReceiverOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting http server', {options: this.options})

        const expressServer = express()
        expressServer.use(cors())
        expressServer.set('json spaces', 2)
        expressServer.use(bodyParser.json())
        expressServer.get('/favicon.ico', (req, res) => res.status(204))

        const resolvers = express.Router()
        resolvers.post(
            '/',
            hae.express(async (req: Request<{}, {}, Message>, res, next) => {
                std.log('http server received', {message: req.body})
                if (check.isDefined(this.processor)) {
                    this.processor(req.body)
                } else {
                    std.log('no processor defined')
                }
                return res.status(200).json({})
            })
        )

        expressServer.use(resolvers)
        expressServer.use(
            '*',
            hae.express((req, res, next) => {
                throw new createError.NotFound()
            })
        )

        const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
            std.log(error.stack)
            return res.status(error.status || 500).json({error: error.msg || error.message || error})
        }
        expressServer.use(errorHandler)

        this.server = http.createServer(expressServer)

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`http server is now running on "http://${this.options.host}:${this.options.port}"`)
            this.resolveReady()
        })
    }

    async stop() {
        std.log('stopping http server')
        await this.stopServer()
        std.log('http server stopped')
    }

    private async stopServer() {
        if (check.isUndefined(this.server)) return std.log('http server not defined')
        const server = this.server
        return new Promise<void>((resolve, reject) => {
            server.close(error => {
                if (check.isDefined(error)) return reject(error)
                return resolve()
            })
        })
    }
}
