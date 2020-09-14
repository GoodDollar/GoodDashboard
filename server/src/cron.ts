import { CronJob } from 'cron'
import AsyncLock from 'async-lock'

import Config from './config'
import Blockchain from './providers/blockchain'
import logger from './helpers/pino-logger'

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
      await mutex.acquire(MUTEX_ID, async () => {
        logger.info('******** Start update blockchain data **************')
        await provider.updateData()
      })

      logger.info('Blockchain data updated successfully')
    } catch (exception) {
      logger.warn('Blockchain data update failed', exception.message, exception)
    } finally {
      logger.info('******** End update blockchain data **************')
    }
  }
}

export default new Cron(Config, Blockchain, new AsyncLock(), CronJob, logger)
