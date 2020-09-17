import { CronJob } from 'cron'
import Mutex from 'await-mutex'

import Config from './config'
import Blockchain from './providers/blockchain'
import logger from './helpers/pino-logger'

const log = logger.child({ from: 'Cron' })

declare var process: any

class Cron {
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
    const { mutex, logger, provider } = this
    const release = await mutex.lock()

    try {
      log.info('******** Start update blockchain data **************')
      await provider.updateData()
      log.info('Blockchain data updated successfully')
    } catch (exception) {
      log.warn('Blockchain data update failed', exception.message, exception)
    } finally {
      release()
      log.info('******** End update blockchain data **************')
    }
  }
}

export default new Cron(Config, Blockchain, new Mutex(), CronJob, logger)
