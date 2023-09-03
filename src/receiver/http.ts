import {Receiver} from '#/receiver/receiver'
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
    port?: number
    host?: string
}

export class HTTPReceiver extends Receiver {
    server?: http.Server
    options: Required<HTTPReceiverOptions>

    constructor(options?: HTTPReceiverOptions) {
        super()
        this.options = {port: options?.port ?? 4269, host: options?.host ?? 'localhost'}
    }

    async start() {
        const expressServer = express()
        expressServer.use(cors())
        expressServer.set('json spaces', 2)
        expressServer.use(bodyParser.json())
        expressServer.get('/favicon.ico', (req, res) => res.status(204))

        const resolvers = express.Router()
        resolvers.post(
            '/',
            hae.express(async (req: Request<{}, {}, {id: number; data: number[]}>, res, next) => {
                if (check.isDefined(this.processor)) this.processor(req.body)
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
            std.log(`Server is now running on http://${this.options.host}:${this.options.port}`)
        })
    }

    async stop() {
        if (check.isDefined(this.server)) this.server.close()
    }
}
