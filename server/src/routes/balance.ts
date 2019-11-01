import { Router } from 'express'
import balance from '../controllers/balance'
const router = Router()

router.get('/getTopLowMediumBalance', balance.getTopLowMediumBalance);
router.get('/getTopAccounts', balance.getTopAccounts);

export default router