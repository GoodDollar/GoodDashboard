import { Router } from 'express'
import fetch from 'node-fetch'
import { throttle, get, pick } from 'lodash'
import logger from '../../helpers/pino-logger'
import conf from '../../config'

const log = logger.child({ from: 'rates api' })

const router = Router()
const { defipulseKey } = conf
const interestRatesUrl = `https://data-api.defipulse.com/api/v1/defipulse/api/GetRates?token=DAI&api-key=${defipulseKey}`

const getInterestRates = throttle(async () => {
  try {
    const rates = await fetch(interestRatesUrl, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        Accept: '*/*',
      },
    }).then((_) => _.json())
    return pick(get(rates, 'rates', {}), ['Maker', 'Compound'])
  } catch (e) {
    log.error('failed fetching interest rates:', { e, message: e.message })
    return { success: false, error: e.message }
  }
}, 1000 * 60 * 60)

router.get('/rates', async (req, res) => {
  const rates = await getInterestRates()
  res.status(rates.error ? 400 : 200).json(rates)
})

export default router
