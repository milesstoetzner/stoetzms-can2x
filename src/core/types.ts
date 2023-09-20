import Message from '#core/message'

export type Processor = (message: Message) => Promise<void>

// TODO: merge this message.ts?
