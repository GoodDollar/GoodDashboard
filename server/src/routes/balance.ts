import { Router } from 'express'
import balance from '../controllers/balance'
const router = Router()

router.get('/all', balance.getAll);

export default router