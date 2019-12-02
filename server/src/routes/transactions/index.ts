import { Router } from 'express'
import transactions from '../../controllers/transactions'
const router = Router()

router.get('/total', transactions.getTotal)
router.get('/total-amount', transactions.getTotalAmount)
router.get('/avg-amount', transactions.getAvgAmount)

router.get('/count-per-day', transactions.getCountPerDay)
router.get('/amount-per-day', transactions.getAmountPerDay)
router.get('/sum-amount-per-day', transactions.getSumAmountPerDay)


export default router