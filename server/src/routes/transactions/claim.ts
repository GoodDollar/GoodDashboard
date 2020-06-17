import { Router } from 'express'
import claimTransaction from '../../controllers/claim-transaction'
import transaction from "../../controllers/transaction";
const router = Router()

router.get('/', claimTransaction.getTotal)
router.get('/supply-amount-per-day', claimTransaction.getSupplyAmountPerDay)

export default router