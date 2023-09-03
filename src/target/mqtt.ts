import {Message} from '#/core/message'
import {Target} from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import std from '#std'
import * as mqtt from 'mqtt'

export type MQTTTargetOptions = {
    endpoint: string
    topic: string
}

export class MQTTTarget extends Target {
    target?: mqtt.MqttClient
    options: MQTTTargetOptions

    constructor(options: MQTTTargetOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting mqtt target', {options: this.options})

        this.target = await mqtt.connectAsync(this.options.endpoint)
        std.log(`mqtt target connected`)

        await this.target.subscribeAsync(this.options.topic)
        std.log(`mqtt target subscribed`)

        this.target.on('error', error => {
            std.log(`mqtt target errored`, {error})
        })

        this.target.on('disconnect', () => {
            std.log(`mqtt target disconnected`)
        })

        this.target.on('offline', () => {
            std.log(`mqtt target offline`)
        })

        this.target.on('close', () => {
            std.log(`mqtt target closed`)
        })

        this.target.on('end', () => {
            std.log(`mqtt target ended`)
        })

        this.resolveReady()
        std.log('mqtt target started')
    }

    async send(message: Message) {
        std.log('mqtt target publishing', {message})
        assert.isDefined(this.target, 'mqtt target not started')
        await this.target.publishAsync(this.options.topic, JSON.stringify(message))
        std.log('mqtt target published')
    }

    async stop() {
        std.log('stopping mqtt target')
        if (check.isDefined(this.target)) await this.target.endAsync()
        std.log('mqtt target stopped')
    }
}
