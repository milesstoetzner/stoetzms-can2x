import {Sender} from '#/sender/sender'
import {Message} from '#/types'
import * as files from '#files'

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
        await files.createFile(this.options.file)
        await files.appendFile(this.options.file, JSON.stringify(message) + '\n')
    }
}
