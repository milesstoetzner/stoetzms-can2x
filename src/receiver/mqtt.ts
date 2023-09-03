import {Receiver} from '#/receiver/receiver'
import {Message} from '#/types'
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
    server?: net.Server
    options: MQTTReceiverOptions

    constructor(options: MQTTReceiverOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting mqtt server', {options: this.options})

        const aedes = new Aedes()

        this.server = net.createServer(aedes.handle)

        aedes.on('subscribe', (subscriptions, client) => {
            std.log('mqtt client subscribed', {id: client.id, subscriptions: subscriptions.map(it => it.topic)})
        })

        aedes.on('unsubscribe', (subscriptions, client) => {
            std.log('mqtt client unsubscribed', {id: client.id, subscriptions: subscriptions})
        })

        aedes.on('client', client => {
            std.log('mqtt client connected', {id: client.id})
        })

        aedes.on('clientDisconnect', client => {
            std.log('mqtt client disconnected', {id: client.id})
        })

        aedes.on('publish', (packet, client) => {
            const topic = packet.topic
            const message = packet.payload.toString()

            std.log('mqtt server message', {message, topic})
            if (topic.startsWith('$SYS')) return
            if (topic !== this.options.topic) return std.log('topic unknown', {topic})

            if (check.isDefined(this.processor)) {
                this.processor(JSON.parse(message) as Message)
            } else {
                std.log('no processor defined')
            }
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
        if (check.isDefined(this.server)) this.server.close()
    }
}
