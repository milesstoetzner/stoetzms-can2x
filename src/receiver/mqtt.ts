import {Message} from '#/core/message'
import {Receiver} from '#/receiver/receiver'
import std from '#std'
import * as check from '#utils/check'
import Aedes from 'aedes'
import net from 'net'

export type MQTTReceiverOptions = {
    port: number
    host: string
    topic: string
}

export class MQTTReceiver extends Receiver {
    aedes?: Aedes
    server?: net.Server
    options: MQTTReceiverOptions

    constructor(options: MQTTReceiverOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting mqtt server', {options: this.options})

        this.aedes = new Aedes()

        this.server = net.createServer(this.aedes.handle)

        this.aedes.on('subscribe', (subscriptions, client) => {
            std.log('mqtt client subscribed', {id: client.id, subscriptions: subscriptions.map(it => it.topic)})
        })

        this.aedes.on('unsubscribe', (subscriptions, client) => {
            std.log('mqtt client unsubscribed', {id: client.id, subscriptions: subscriptions})
        })

        this.aedes.on('client', client => {
            std.log('mqtt client connected', {id: client.id})
        })

        this.aedes.on('clientDisconnect', client => {
            std.log('mqtt client disconnected', {id: client.id})
        })

        this.aedes.on('publish', packet => {
            const topic = packet.topic
            const message = packet.payload.toString()

            std.log('mqtt server received', {message, topic})
            if (topic.startsWith('$SYS')) return
            if (topic !== this.options.topic) return std.log('topic unknown', {topic})

            if (check.isUndefined(this.processor)) return std.log('no processor defined')
            this.processor(JSON.parse(message) as Message)
        })

        this.server.listen({port: this.options.port, host: this.options.host}, () => {
            std.log(`mqtt server is now running on "mqtt://${this.options.host}:${this.options.port}"`)
            this.resolveReady()
        })

        this.server.on('error', error => {
            std.log('mqtt server error', {error})
        })
    }

    async stop() {
        std.log('stopping mqtt server')

        std.log('stopping mqtt aedes server')
        await this.stopAedes()
        std.log('mqtt aeded server stopped')

        std.log('stopping mqtt http server')
        await this.stopServer()
        std.log('mqtt http server stopped')

        std.log('mqtt server stopped')
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
