import app from './app'
import cron from './cron'
import mongoose from './mongo-db'
/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  const EXIT_EVENTS: any[] = ['SIGINT', 'SIGTERM', 'SIGQUIT']

  const handleExit = (signal: any): void => {
    const http = <any>server

    console.log(`Received ${signal}. Closing server properly.`)

    cron.stop()
    http.close(() => mongoose.connection.close(false, () => process.exit(0)))
  }

  console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'))

  cron.start()

  console.log(' Cron job started with schedule %s', cron.schedule)

  console.log('  HealthCheck: http://localhost:%d/api/health-check\n', app.get('port'))
  console.log('  Press CTRL-C to stop\n')

  EXIT_EVENTS.forEach((event) => process.on(event, handleExit))
})

export default server
