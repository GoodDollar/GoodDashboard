import express from 'express'
import path from 'path'
import routes from './routes'
import bodyParser from 'body-parser'

// Create Express server
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})


// Express configuration
app.set('port', process.env.PORT || 3000)

// Routes configuration
app.use('/api', routes)

export default app
