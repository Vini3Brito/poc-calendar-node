import express, { Request, Response } from 'express'
import { CalendarService, CredentialsService } from '../../services'

const CalendarRouter = () => {
    const router = express.Router()
    const calendarService = CalendarService()
    const credentialsService = CredentialsService()

    router.get('/calendar/now', async (req: Request, res: Response) => {
        try {
            const auth = await credentialsService.authorize()
            const events = await calendarService.listEvents(auth)
            res.status(200).json(events)
        } catch(err) {
            console.error('Error while fetching calendar events', err)
            res.status(500).json('')
        }
    })

    return router
}

export { CalendarRouter }
