import Target from '#/target/target'
import * as assert from '#assert'
import * as check from '#check'
import Message, {JSONMessage} from '#core/message'
import std from '#std'
import SocketIOClient, {Socket} from 'socket.io-client'

export type SocketIOTargetOptions = {
    endpoint: string
    event: string
    bidirectional: boolean
}

export class SocketIOTarget extends Target {
    target?: Socket
    options: SocketIOTargetOptions

    constructor(options: SocketIOTargetOptions) {
        super()
        this.options = options
    }

    async start() {
        std.log('starting socketio target')

        this.target = SocketIOClient(this.options.endpoint)

        this.target.on('connect', () => {
            std.log(`socketio target connected`, {id: this.target!.id})
            this.readyPromise.resolve()
            std.log('socketio target started')
        })

        this.target.on('connect_error', error => {
            std.log(`socketio target errored`, {error})
        })

        this.target.on('close', reason => {
            std.log(`socketio target closed`, {reason})
        })

        this.target.on('disconnect', reason => {
            std.log(`socketio target disconnected`, {reason})
        })

        if (this.options.bidirectional) {
            this.target.on(this.options.event, (message: JSONMessage) => {
                std.log('socketio target received')
                if (check.isUndefined(this.processor)) return std.log('no processor defined')
                this.processor(Message.fromJSON(message))
            })
        }
    }

    async send(message: Message) {
        std.log('socketio target sending', {message})
        assert.isDefined(this.target, 'socketio target not started')
        this.target.emit(this.options.event, message)
        std.log('socketio target sent')
    }

    async stop() {
        // TODO: wait for disconnect
        std.log('stopping socketio target')
        if (check.isDefined(this.target)) this.target.disconnect()
        std.log('socketio target stopped')
    }
}
