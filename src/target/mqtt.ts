import Target from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import Message from '#core/message'
import std from '#std'
import hae from '#utils/hae'
import * as mqtt from 'mqtt'

export type MQTTTargetOptions = {
    endpoint: string
    topic: string
    bidirectional: boolean
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

        const target = await mqtt.connectAsync(this.options.endpoint)
        this.target = target
        std.log(`mqtt target connected`)

        await target.subscribeAsync(this.options.topic)
        std.log(`mqtt target subscribed`)

        target.on('error', error => {
            std.log(`mqtt target errored`, {error})
        })

        target.on('disconnect', () => {
            std.log(`mqtt target disconnected`)
        })

        target.on('offline', () => {
            std.log(`mqtt target offline`)
        })

        target.on('close', () => {
            std.log(`mqtt target closed`)
        })

        target.on('end', () => {
            std.log(`mqtt target ended`)
        })

        if (this.options.bidirectional) {
            this.target.on('message', (topic, buffer) => {
                std.log('mqtt target received', {message: buffer, topic})
                if (topic.startsWith('$SYS')) return
                if (topic !== this.options.topic) return std.log('topic unknown', {topic})

                const message = Message.fromBuffer(buffer)
                if (check.isDefined(message.origin) && message.origin === target.options.clientId)
                    return std.log('ignoring own message')

                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(message)
            })
        }

        this.setReady()
        std.log('mqtt target started')
    }

    async send(message: Message) {
        std.log('mqtt target publishing', {message})
        assert.isDefined(this.target, 'mqtt target not started')
        message.origin = this.target.options.clientId
        await this.target.publishAsync(this.options.topic, message.toString())
        std.log('mqtt target published')
    }

    async stop() {
        std.log('stopping mqtt target')
        await hae.try(async () => {
            if (check.isDefined(this.target)) await this.target.endAsync()
        }, 'problem when stopping mqtt target')
        std.log('mqtt target stopped')
    }
}
