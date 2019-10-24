import { Router } from 'express'
import { badRequest, clientErrorHandler, healthCheck, logErrors } from './common.js'

const router = Router()

/* common */
router.get('/health-check', healthCheck)
router.use(logErrors)
router.use(clientErrorHandler)
router.use(badRequest)




export default router