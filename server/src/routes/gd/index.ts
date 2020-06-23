import { Router } from 'express'
import gd from '../../controllers/gd'

const router = Router()

router.get('/total', gd.getTotal)
router.get('/in-escrow', gd.getInEscrow)
router.get('/total-impact-statistics', gd.totalImpactStatistic)

export default router
