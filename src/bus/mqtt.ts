import Bus from '#/bus/bus'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
import Aedes from 'aedes'
import net from 'net'

export type MQTTBusOptions = {
    port: number
    host: string
    topic: string
}

export class MQTTBus extends Bus {
    aedes?: Aedes
    server?: net.Server
    options: MQTTBusOptions

    constructor(options: MQTTBusOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting mqtt server', {options: this.options})

        this.aedes = new Aedes()

        this.server = net.createServer(this.aedes.handle)

        this.aedes.on('subscribe', (subscriptions, source) => {
            std.log('mqtt bus subscribed', {id: source.id, subscriptions: subscriptions.map(it => it.topic)})
        })

        this.aedes.on('unsubscribe', (subscriptions, source) => {
            std.log('mqtt bus unsubscribed', {id: source.id, subscriptions: subscriptions})
        })

        this.aedes.on('client', source => {
            std.log('mqtt bus connected', {id: source.id})
        })

        this.aedes.on('clientDisconnect', source => {
            std.log('mqtt bus disconnected', {id: source.id})
        })

        this.aedes.on('publish', (packet, client) => {
            const topic = packet.topic
            const message = packet.payload.toString()

            std.log('mqtt bus received', {message, topic})
            if (topic.startsWith('$SYS')) return
            if (topic !== this.options.topic) return std.log('topic unknown', {topic})

            return new Promise<void>((resolve, reject) => {
                if (check.isUndefined(client)) return std.log('mqtt bus client not defined')
                client.publish(packet, error => {
                    if (check.isDefined(error)) return reject(error)
                    std.log('mqtt bus sent')
                    return resolve()
                })
            })
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`mqtt bus is now running on "mqtt://${this.options.host}:${this.options.port}"`)
            this.setReady()
        })

        this.server.on('error', error => {
            std.log('mqtt bus error', {error})
        })
    }

    async stop() {
        std.log('stopping mqtt bus')

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

        std.log('mqtt bus stopped')
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
