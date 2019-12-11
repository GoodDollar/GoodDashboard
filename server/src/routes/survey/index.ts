import { Router } from 'express'
import survey from "../../controllers/survey";

const router = Router()

router.get('/total', survey.getTotal);

export default router