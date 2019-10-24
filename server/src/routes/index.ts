import { Router } from 'express'
import { badRequest, clientErrorHandler, healthCheck, logErrors } from './common.js'
import  balance  from './balance'
import app from "../app";

const router = Router()

/* common */
router.get('/health-check', healthCheck)

router.use('/balance', balance)

router.use(logErrors)
router.use(clientErrorHandler)
router.use(badRequest)




export default router