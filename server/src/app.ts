import express from 'express'
import { CronJob } from 'cron'
import path from 'path'
import cors from 'cors'
import routes from './routes'
import bodyParser from 'body-parser'
import Blockchain from './providers/blockchain'
import conf from './config'
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

const job = new CronJob(conf.cronTimeExpression, function() {
  console.log('******** Start update data **************')
  Blockchain.updateData()
}, null, true, conf.cronTimeZone, null, true);

job.start();

export default app
