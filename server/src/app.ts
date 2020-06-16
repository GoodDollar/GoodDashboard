import express from 'express'
import { CronJob } from 'cron'
import AsyncLock from 'async-lock'
import path from 'path'
import cors from 'cors'
import routes from './routes'
import bodyParser from 'body-parser'
import Blockchain from './providers/blockchain'
import conf from './config'
import logger from './helpers/pino-logger'
// Create Express server
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Routes configuration
app.use('/api', routes)
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
app.use((req, res) => res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html')))

// Express configuration
app.set('port', process.env.PORT || 3055)

// getting required configs for cron jobs
const { cronTimeExpression, cronTimeZone } = conf

// preventing task to be executed more than once at the same time
const lock = new AsyncLock()

// initializing cron jobs
const job = new CronJob(cronTimeExpression, async () => {
  try {

    await lock.acquire('updateData', async () => {
      logger.info('******** Start update blockchain data **************')
      await Blockchain.updateData()
    })

    logger.info('Blockchain data updated successfully')
  } catch (exception) {
    logger.warn('Blockchain data update failed', exception.message, exception)
  } finally {
    logger.info('******** End update blockchain data **************')
  }
}, null, true, cronTimeZone, null, true);

// starting cron jobs
job.start();

// @ts-ignore
['SIGINT', 'SIGTERM', 'exit'].forEach((event: string) => process.on(event, () => job.stop))

export default app
