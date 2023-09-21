import Message from '#core/message'

export type Processor = (message: Message) => Promise<void>

export type JSONObject = string | number | boolean | JSONObject[] | {[key: string]: JSONObject}
