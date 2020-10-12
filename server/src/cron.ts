import { CronJob } from 'cron'
import AsyncLock from 'async-lock'

import Config from './config'
import Blockchain from './providers/blockchain'
import logger from './helpers/pino-logger'

const log = logger.child({ from: 'Cron' })
declare var process: any

class Cron {
  private static readonly MUTEX_ID = 'updateData'

  readonly schedule: string
  readonly timeZome: string
  private job: any

  constructor(
    config: any,
    private readonly provider: any,
    private readonly mutex: any,
    private readonly jobFactory: any,
    private readonly logger: any
  ) {
    const { cronTimeExpression, cronTimeZone } = config

    this.schedule = cronTimeExpression
    this.timeZome = cronTimeZone
  }

  public start(): void {
    const { jobFactory, timeZome, schedule } = this

    this.job = new jobFactory(schedule, () => this.execute(), null, true, timeZome, null, true)
  }

  public stop(): void {
    const { job } = this

    job.stop()
  }

  private async execute(): Promise<void> {
    const { MUTEX_ID } = Cron
    const { mutex, logger, provider } = this

    try {
      log.info('******** Start update blockchain data **************')
      await mutex.acquire(MUTEX_ID, async () => {
        log.info('******** Acquired update blockchain lock **************')
        await provider.updateData()
      })

      log.info('Blockchain data updated successfully')
    } catch (exception) {
      log.warn('Blockchain data update failed', exception.message, exception)
    } finally {
      log.info('******** End update blockchain data **************')
    }
  }
}

export default new Cron(Config, Blockchain, new AsyncLock({ timeout: 60000 * 10 }), CronJob, logger)
