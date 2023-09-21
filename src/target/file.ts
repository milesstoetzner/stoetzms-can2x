import Target from '#/target/target'
import Message from '#core/message'
import * as files from '#files'
import std from '#std'

export type FileTargetOptions = {
    file: string
}

export class FileTarget extends Target {
    options: FileTargetOptions

    constructor(options: FileTargetOptions) {
        super()
        this.options = options
    }

    async send(message: Message) {
        std.log('file target sending', {message})
        await files.createFile(this.options.file)
        await files.appendFile(this.options.file, message.toString() + '\n')
        std.log('file target sent')
    }
}
