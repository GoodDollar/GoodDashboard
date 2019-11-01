import express from 'express'
import path from 'path'
import routes from './routes'
import bodyParser from 'body-parser'
import Blockchain from './providers/blockchain'

// Create Express server
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'))
})


// Express configuration
app.set('port', process.env.PORT || 3022)

// Routes configuration
app.use('/api', routes)

if (Blockchain.ready) {
  Blockchain.updateListWallets()
}

export default app
