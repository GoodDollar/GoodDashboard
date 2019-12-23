import { Router } from 'express'
import serviceTransaction from '../../controllers/service-transaction'
const router = Router()

router.get('/', serviceTransaction.getTotal)


export default router