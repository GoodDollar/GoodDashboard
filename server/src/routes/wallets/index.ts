import { Router } from 'express'
import balance from "./balance";
import transactions from "./transactions";
const router = Router()

router.use('/balance', balance)
router.use('/transactions', transactions)


export default router