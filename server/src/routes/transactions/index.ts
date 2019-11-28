import { Router } from 'express'
import transactions from '../../controllers/transactions'
const router = Router()

router.get('/total', transactions.getTotal)
router.get('/total-amount', transactions.getTotalAmount)
router.get('/avg-amount', transactions.getAvgAmount)


export default router