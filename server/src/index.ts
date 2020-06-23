import app from './app'
import cron from './cron'

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  )

  cron.start()

  console.log(
    ' Cron job started with schedule %s',
    cron.schedule
  )

  console.log('  HealthCheck: http://localhost:%d/api/health-check\n', app.get('port'))
  console.log('  Press CTRL-C to stop\n')
})

export default server