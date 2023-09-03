import {Message} from '#/core/message'
import {Sender} from '#/sender/sender'
import * as files from '#files'
import std from '#std'
export type FileSenderOptions = {
    file: string
}

export class FileSender extends Sender {
    options: FileSenderOptions

    constructor(options: FileSenderOptions) {
        super()
        this.options = options
    }

    async send(message: Message) {
        std.log('writing to file')
        await files.createFile(this.options.file)
        await files.appendFile(this.options.file, JSON.stringify(message) + '\n')
        std.log('wrote to file')
    }
}
