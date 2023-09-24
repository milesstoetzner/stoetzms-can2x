import Target from '#/target/target'
import * as check from '#check'
import Message from '#core/message'
import std from '#std'
import fs from 'node:fs'

export type FileTargetOptions = {
    file: string
}

export class FileTarget extends Target {
    options: FileTargetOptions
    stream?: fs.WriteStream

    constructor(options: FileTargetOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting file target')

        this.stream = fs.createWriteStream(this.options.file, {flags: 'a'})
        this.setReady()

        std.log('file target started')
    }

    async stop() {
        std.log('stopping file target')

        await new Promise<void>((resolve, reject) => {
            if (check.isUndefined(this.stream)) {
                std.log('file not opened')
                return resolve()
            }
            this.stream.end(() => resolve())
        })

        std.log('file target stopped')
    }

    async send(message: Message) {
        std.log('file target sending', {message})
        message.clean()

        await new Promise<void>((resolve, reject) => {
            if (check.isUndefined(this.stream)) return std.log('file not opened')
            this.stream.write(message.toString() + '\n', error => {
                if (check.isDefined(error)) std.log(error)
                return resolve()
            })
        })

        std.log('file target sent')
    }
}
