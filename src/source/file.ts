import Source from '#/source/source'
import Message from '#core/message'
import std from '#std'
import * as check from '#utils/check'
import hae from '#utils/hae'
import {Tail} from 'tail'

export type FileSourceOptions = {
    file: string
}

export class FileSource extends Source {
    source?: Tail
    options: FileSourceOptions

    constructor(options: FileSourceOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting file source', {options: this.options})

        this.source = new Tail(this.options.file)

        this.source.on('line', (message: string) => {
            std.log('file source received', {message})
            if (check.isUndefined(this.processor)) return std.log('no processor defined')
            this.processor(Message.fromString(message))
        })

        this.source.on('error', error => {
            std.log('file source error', {error})
        })

        this.source.watch()
        this.setReady()
        std.log('file source started')
    }

    async stop() {
        std.log('stopping file source')

        await hae.try(async () => {
            if (check.isUndefined(this.source)) return std.log('file source not defined')
            this.source.unwatch()
        }, 'problem while stopping file source')

        std.log('file source stopped')
    }
}
