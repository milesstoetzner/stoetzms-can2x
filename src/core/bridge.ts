import Source from '#/source/source'
import Target from '#/target/target'
import * as assert from '#assert'
import std from '#std'
import hae from '#utils/hae'

export class Bridge {
    source: Source
    target: Target

    constructor(source: Source, target: Target) {
        this.source = source
        this.target = target
    }

    async start() {
        std.log('starting source')
        await this.source.start()

        std.log('starting target')
        await this.target.start()

        await this.source.ready()
        std.log('source ready')

        await this.target.ready()
        std.log('target ready')

        std.log('bridge started')
        await this.source.receive(
            hae.log(async message => {
                std.log('bridging forward', {message})
                assert.isMessage(message)
                await this.target.send(message)
                if (!this.source.continuous) await this.stop()
            })
        )

        await this.target.receive(
            hae.log(async message => {
                std.log('bridging backward', {message})
                assert.isMessage(message)
                await this.source.send(message)
            })
        )
    }

    async stop() {
        std.log('stopping bridge')
        await this.source.stop()
        await this.target.stop()
        std.log('bridge stopped')
    }
}
