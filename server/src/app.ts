import express from 'express'
import path from 'path'
import cors from 'cors'
import routes from './routes'
import bodyParser from 'body-parser'
import compression from 'compression'
// Create Express server
const app = express()

app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Routes configuration
app.use('/api', routes)
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
app.use((req, res) => res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html')))

// Express configuration
app.set('port', process.env.PORT || 3055)

export default app
