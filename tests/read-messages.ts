import Message from '#core/message'
import * as files from '#files'

/**
 * Reads the messages written by a file target, without their timestamps, since these differ in every run.
 */
export function readMessages(file: string): string[] {
    return files
        .loadFile(file)
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => Message.fromJSON({...JSON.parse(line), timestamp: undefined}).toString())
}
