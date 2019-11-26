import { Router } from 'express'
import walletsTransactions from '../../controllers/wallets-transactions'
const router = Router()

router.get('/top-low-medium-avr-balance', walletsTransactions.getTopLowMediumBalance);
router.get('/top-accounts', walletsTransactions.getTopAccounts);
router.get('/distribution-histogram', walletsTransactions.getDistributionHistogram);

export default router