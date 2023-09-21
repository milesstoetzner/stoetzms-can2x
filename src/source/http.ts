import Source from '#/source/source'
import Message from '#core/message'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
import bodyParser from 'body-parser'
import cors from 'cors'
import type {ErrorRequestHandler} from 'express'
import express, {Request} from 'express'
import http from 'http'
import createError from 'http-errors'

export type HTTPSourceOptions = {
    port: number
    host: string
}

export class HTTPSource extends Source {
    source?: http.Server
    options: HTTPSourceOptions

    constructor(options: HTTPSourceOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting http source', {options: this.options})

        const expressServer = express()
        expressServer.use(cors())
        expressServer.set('json spaces', 2)
        expressServer.use(bodyParser.json())
        expressServer.get('/favicon.ico', (req, res) => res.status(204))

        const resolvers = express.Router()
        resolvers.post(
            '/',
            hae.express(async (req: Request<{}, {}, Message>, res, next) => {
                std.log('http source received', {message: req.body})

                if (check.isDefined(this.processor)) {
                    this.processor(Message.fromJSON(req.body))
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

        this.source = http.createServer(expressServer)

        this.source.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`http source is now running on "http://${this.options.host}:${this.options.port}"`)
            this.readyPromise.resolve()
        })
    }

    async stop() {
        std.log('stopping http source')
        await this.stopSource()
        std.log('http source stopped')
    }

    private async stopSource() {
        if (check.isUndefined(this.source)) return std.log('http source not defined')
        const source = this.source
        return new Promise<void>((resolve, reject) => {
            source.close(error => {
                if (check.isDefined(error)) return reject(error)
                return resolve()
            })
        })
    }
}
