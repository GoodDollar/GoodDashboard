import { Router } from 'express'
import claimTransaction from '../../controllers/claim-transaction'
const router = Router()

router.get('/', claimTransaction.getTotal)


export default router