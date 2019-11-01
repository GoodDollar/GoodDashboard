import { Router } from 'express'
import balance from '../controllers/balance'
const router = Router()

router.get('/get-top-low-medium-balance', balance.getTopLowMediumBalance);
router.get('/get-top-accounts', balance.getTopAccounts);

export default router