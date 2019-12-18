import fetch from 'node-fetch'
import conf from '../config'
import logger from '../helpers/pino-logger'
const log = logger.child({ from: 'Amplitude' })

/**
 * log blockchain events to amplitude
 */
export default class Amplitude {
  events: Array<any> = []

  logEvent(event: any): Promise<any> {
    this.events.push(event)
    if (this.events.length === 100) {
      return this.sendBatch()
    }
    return Promise.resolve()
  }

  async sendBatch(): Promise<any> {
    const events = [...this.events]
    this.events = []
    if (conf.amplitudeKey == null) return
    const data = {
      api_key: conf.amplitudeKey,
      events,
    }
    const response = await fetch('https://api.amplitude.com/2/httpapi', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    log.debug('Batch sent. size:', events.length)
    return response.json()
  }
}
