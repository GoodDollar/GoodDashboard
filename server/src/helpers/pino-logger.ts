import pino from 'pino'

import conf from '../config'

const LOG_LEVEL = conf.logLevel || 'debug'

console.log('Starting logger', {LOG_LEVEL, env: conf.env})

const logger = pino({
  name: 'GoodDollar - Dashboard',
  level: LOG_LEVEL,
  redact: {
    paths: ['req.headers.authorization'],
    censor: '*** private data ***'
  }
})

let error = logger.error

logger.error = function (...props: any) {
  return error.apply(logger, props)
}

export default logger
