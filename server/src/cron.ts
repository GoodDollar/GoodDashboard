import { CronJob } from 'cron'
import AsyncLock from 'async-lock'

import Config from './config'
import Blockchain from './providers/blockchain'
import logger from './helpers/pino-logger'

declare var process: any

class Cron {
  private static readonly MUTEX_ID = 'updateData'
  private static readonly EXIT_EVENTS =  ['SIGINT', 'SIGTERM', 'exit']

  readonly schedule: string
  readonly timeZome: string

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
    const { EXIT_EVENTS } = Cron
    const { jobFactory, timeZome, schedule } = this
    const job = new jobFactory(schedule, () => this.execute(), null, true, timeZome, null, true)

    EXIT_EVENTS.forEach((event: string) => process.on(event, () => job.stop()))
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
