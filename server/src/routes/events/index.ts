import { Router } from 'express'
import events from '../../controllers/events'
const router = Router()

router.get('/csv', events.getEventsCSV)

export default router
