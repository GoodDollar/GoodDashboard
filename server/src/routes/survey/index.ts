import { Router } from 'express'
import survey from "../../controllers/survey";

const router = Router()

router.get('/total-per-day', survey.getTotalPerDay);

export default router