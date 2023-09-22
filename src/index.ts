#!/usr/bin/env node

import actions from '#actions'
import hae from '#utils/hae'
import {Command, Option} from 'commander'

export const program = new Command()

const can2x = program
    .name('can2x')
    .version('__VERSION__')
    .description(
        'can2x is a simple utility for connecting a can bus unidirectional with one or multiple CAN busses over the network using common web protocols, such as HTTP, MQTT, Socket.IO, and WebSockets.'
    )

const bridge = can2x.command('bridge').description('manages a can2x bridge')

bridge
    .command('start')
    .description('starts a can2x bridge')
    .addOption(
        new Option('--source [string]', '')
            .default('can')
            .choices(['can', 'console', 'file', 'http', 'mqtt', 'socketio', 'ws'])
    )
    .option('--source-port [number]', '', '3000')
    .option('--source-host [string]', '', 'localhost')
    .option('--source-event [string]', '', 'can2x')
    .option('--source-topic [string]', '', 'can2x')
    .option('--source-name [string]', '', 'can2x')
    .option('--source-id [number]', '')
    .option('--source-data [numbers...]', '')
    .option('--source-ext [boolean]', '', false)
    .option('--source-rtr [boolean]', '', false)
    .option('--source-file [boolean]', '')
    .option('--source-bidirectional [boolean]', '', true)
    .addOption(
        new Option('--target [string]', '')
            .default('console')
            .choices(['can', 'console', 'file', 'http', 'mqtt', 'socketio', 'ws'])
    )
    .option('--target-endpoint [string]', '')
    .option('--target-event [string]', '', 'can2x')
    .option('--target-topic [string]', '', 'can2x')
    .option('--target-name [string]', '', 'can2x')
    .option('--target-file [string]', '')
    .option('--target-bidirectional [boolean]', '', true)
    .action(
        hae.exit(async options => {
            await actions.bridge.start(options)
        })
    )

const bus = can2x.command('bus').description('manages a bus')

bus.command('start')
    .description('starts a bus')
    .addOption(new Option('--bus [string]', '').default('socketio').choices(['socketio']))
    .option('--port [number]', '', '3000')
    .option('--host [string]', '', 'localhost')
    .option('--event [string]', '', 'can2x')
    .action(
        hae.exit(async options => {
            await actions.bus.start(options)
        })
    )

const vcan = can2x.command('vcan').description('manages a vcan')

vcan.command('check')
    .description('checks if vcan is supported')
    .action(
        hae.exit(async () => {
            await actions.vcan.check()
        })
    )

vcan.command('start')
    .description('starts a vcan')
    .option('--name [string]', '', 'can2x')
    .action(
        hae.exit(async options => {
            await actions.vcan.start(options)
        })
    )

vcan.command('stop')
    .description('stops a vcan')
    .option('--name [string]', 'the name of the vcan', 'can2x')
    .action(
        hae.exit(async options => {
            await actions.vcan.stop(options)
        })
    )

program.parse()
