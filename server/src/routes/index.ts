import { Router } from 'express'
import { badRequest, clientErrorHandler, healthCheck, logErrors } from './common.js'
import  wallets  from './wallets'
import  transactions  from './transactions/index'
// import transactions from '../controllers/transactions'
const router = Router()

/* common */
router.get('/health-check', healthCheck)
// router.get('/transactions/total', transactions.getTotal)

router.use('/wallets', wallets)
router.use('/transactions', transactions)

router.use(logErrors)
router.use(clientErrorHandler)
router.use(badRequest)




export default router