import { Router } from 'express'
import transactions from '../../controllers/transactions'
const router = Router()

router.get('/total', transactions.getTotal)
router.get('/total_amount', transactions.getTotalAmount)
router.get('/avg_amount', transactions.getAvgAmount)


export default router