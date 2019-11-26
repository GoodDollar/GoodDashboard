import { Router } from 'express'
import walletsBalance from '../../controllers/wallets-balance'
const router = Router()

router.get('/top-low-medium-avr-balance', walletsBalance.getTopLowMediumBalance);
router.get('/top-accounts', walletsBalance.getTopAccounts);
router.get('/distribution-histogram', walletsBalance.getDistributionHistogram);

export default router