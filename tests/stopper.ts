import hae from '#utils/hae'

type Stoppable = {stop(): Promise<void> | void}

/**
 * Collects everything a test starts, so that it is stopped even if the test fails.
 * Otherwise, open servers and sockets keep mocha from exiting.
 */
export class Stopper {
    private stoppables: Stoppable[] = []

    add<T extends Stoppable>(stoppable: T): T {
        this.stoppables.push(stoppable)
        return stoppable
    }

    async stop() {
        for (const stoppable of this.stoppables.reverse()) {
            await hae.try(async () => {
                await stoppable.stop()
            }, 'problem while stopping')
        }
        this.stoppables = []
    }
}
