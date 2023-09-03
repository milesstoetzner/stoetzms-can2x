import * as actions from '#actions'
import hae from '#utils/hae'
import {Command, Option} from 'commander'

export const program = new Command()

const can2x = program.name('can2x')

const bridge = program
    .command('bridge')
    .description('starts a can2x bridge')
    .addOption(new Option('--receiver [string]', '').default('can').choices(['can', 'console', 'http', 'socket-io']))
    .option('--receiver-port [string]', '', '4269')
    .option('--receiver-host [string]', '', 'localhost')
    .option('--receiver-event [string]', '', 'can2x')
    .option('--receiver-id [number]', '')
    .option('--receiver-data [numbers...]', '')
    .addOption(new Option('--sender [string]', '').default('console').choices(['console', 'file', 'http', 'socket-io']))
    .option('--sender-endpoint [string]', '')
    .option('--sender-event [string]', '', 'can2x')
    .option('--sender-file [string]', '')
    .action(hae.exit(actions.bridge))

const vcan = program
    .command('vcan')
    .description('creates a vcan')
    .option('--name', '', 'vcan0')
    .action(hae.exit(actions.vcan))

program.parse()
