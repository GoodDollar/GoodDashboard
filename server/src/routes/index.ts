import { Router } from 'express'
import { badRequest, clientErrorHandler, healthCheck, logErrors } from './common.js'
import wallets from './wallets'
// import survey from './survey'
import transactions from './transactions/index'
import gd from './gd/index'
import events from './events'
// import transactions from '../controllers/transactions'
const router = Router()

/* common */
router.get('/health-check', healthCheck)
// router.get('/transactions/total', transactions.getTotal)

router.use('/wallets', wallets)
//router.use('/survey', survey)
router.use('/transactions', transactions)
router.use('/gd', gd)
router.use('/events', events)

router.use(logErrors)
router.use(clientErrorHandler)
router.use(badRequest)

export default router
