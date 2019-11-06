import { Router } from 'express'
import walletsTransactions from '../../controllers/wallets-transactions'
const router = Router()

router.get('/get-top-low-medium-balance', walletsTransactions.getTopLowMediumBalance);
router.get('/get-top-accounts', walletsTransactions.getTopAccounts);
router.get('/get-distribution-histogram', walletsTransactions.getDistributionHistogram);

export default router