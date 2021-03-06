import { Router } from 'express'
import survey from "../../controllers/survey";

const router = Router()

router.get('/total', survey.getTotal);
router.get('/csv', survey.getCSV);

export default router