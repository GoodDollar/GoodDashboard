import { Router } from 'express'
import transaction from '../../controllers/transaction'
const router = Router()

router.get('/total', transaction.getTotal)
router.get('/total-amount', transaction.getTotalAmount)
router.get('/avg-count', transaction.getAvgCount)

router.get('/count-per-day', transaction.getCountPerDay)
router.get('/total-amount-per-day', transaction.getAmountPerDay)
router.get('/avg-amount-per-day', transaction.getAvgAmountPerDay)


export default router