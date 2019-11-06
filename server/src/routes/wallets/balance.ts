import { Router } from 'express'
import walletsBalance from '../../controllers/wallets-balance'
const router = Router()

router.get('/get-top-low-medium-balance', walletsBalance.getTopLowMediumBalance);
router.get('/get-top-accounts', walletsBalance.getTopAccounts);
router.get('/get-distribution-histogram', walletsBalance.getDistributionHistogram);

export default router