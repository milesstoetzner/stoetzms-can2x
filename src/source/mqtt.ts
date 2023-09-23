import Source from '#/source/source'
import Message from '#core/message'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
import Aedes from 'aedes'
import net from 'net'

export type MQTTSourceOptions = {
    port: number
    host: string
    topic: string
    bidirectional: boolean
}

export class MQTTSource extends Source {
    aedes?: Aedes
    server?: net.Server
    options: MQTTSourceOptions

    constructor(options: MQTTSourceOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting mqtt source', {options: this.options})

        const aedes = new Aedes()
        this.aedes = aedes

        this.server = net.createServer(this.aedes.handle)

        aedes.on('subscribe', (subscriptions, source) => {
            std.log('mqtt source subscribed', {id: source.id, subscriptions: subscriptions.map(it => it.topic)})
        })

        aedes.on('unsubscribe', (subscriptions, source) => {
            std.log('mqtt source unsubscribed', {id: source.id, subscriptions: subscriptions})
        })

        aedes.on('client', source => {
            std.log('mqtt source connected', {id: source.id})
        })

        aedes.on('clientDisconnect', source => {
            std.log('mqtt source disconnected', {id: source.id})
        })

        aedes.on('publish', packet => {
            const topic = packet.topic

            std.log('mqtt source received', {message: packet.payload, topic})
            if (topic.startsWith('$SYS')) return
            if (topic !== this.options.topic) return std.log('topic unknown', {topic})

            const message = Message.fromString(packet.payload.toString())
            if (check.isDefined(message.origin) && message.origin === aedes.id) return std.log('ignoring own message')

            if (check.isUndefined(this.processor)) return std.log('no processor defined')
            this.processor(message)
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`mqtt source is now running on "mqtt://${this.options.host}:${this.options.port}"`)
            this.setReady()
        })

        this.server.on('error', error => {
            std.log('mqtt source error', {error})
        })
    }

    async send(message: Message) {
        std.log('sending mqtt source')
        if (!this.options.bidirectional) return std.log('mqtt source not bidirectional')

        return new Promise<void>((resolve, reject) => {
            if (check.isUndefined(this.aedes)) return std.log('mqtt source not defined')
            message.origin = this.aedes.id
            this.aedes.publish(
                {
                    qos: 0,
                    cmd: 'publish',
                    dup: false,
                    payload: message.toString(),
                    retain: false,
                    topic: this.options.topic,
                },
                error => {
                    if (check.isDefined(error)) return reject(error)
                    std.log('mqtt source sent')
                    return resolve()
                }
            )
        })
    }

    async stop() {
        std.log('stopping mqtt source')

        std.log('stopping mqtt aedes server')
        await hae.try(async () => {
            await this.stopAedes()
        }, 'problem when stopping mqtt aedes server')
        std.log('mqtt aeded server stopped')

        std.log('stopping mqtt http server')
        await hae.try(async () => {
            await this.stopServer()
        }, 'problem when stopping mqtt http server')
        std.log('mqtt http server stopped')

        std.log('mqtt source stopped')
    }

    private async stopServer() {
        if (check.isUndefined(this.server)) return std.log('mqtt http server not defined')
        const server = this.server
        return new Promise<void>((resolve, reject) => {
            server.close(error => {
                if (check.isDefined(error)) return reject(error)
                return resolve()
            })
        })
    }

    private async stopAedes() {
        if (check.isUndefined(this.aedes)) return std.log('mqtt aedes server not defined')
        const aedes = this.aedes
        return new Promise<void>((resolve, reject) => {
            aedes.close(() => {
                return resolve()
            })
        })
    }
}
