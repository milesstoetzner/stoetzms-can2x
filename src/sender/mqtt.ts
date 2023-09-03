import {Sender} from '#/sender/sender'
import {Message} from '#/types'
import * as assert from '#assert'
import * as check from '#check'
import std from '#std'
import * as mqtt from 'mqtt'

export type MQTTSenderOptions = {
    endpoint: string
    topic: string
}

export class MQTTSender extends Sender {
    client?: mqtt.MqttClient
    options: MQTTSenderOptions

    constructor(options: MQTTSenderOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting mqtt client', {options: this.options})

        this.client = await mqtt.connectAsync(this.options.endpoint)
        std.log(`mqtt client connected`)

        await this.client.subscribeAsync(this.options.topic)
        std.log(`mqtt client subscribed`)

        this.client.on('error', error => {
            std.log(`mqtt client errored`, {error})
        })

        this.client.on('disconnect', () => {
            std.log(`mqtt client disconnected`)
        })

        this.client.on('offline', () => {
            std.log(`mqtt client offline`)
        })

        this.client.on('close', () => {
            std.log(`mqtt client closed`)
        })

        this.client.on('end', () => {
            std.log(`mqtt client ended`)
        })

        this.resolveReady()
    }

    async send(message: Message) {
        assert.isDefined(this.client, 'mqtt sender not started')
        await this.client.publishAsync(this.options.topic, JSON.stringify(message))
    }

    async stop() {
        std.log('stopping mqtt client')
        if (check.isDefined(this.client)) await this.client.endAsync(true)
        std.log('mqtt client stopped')
    }
}
