import express from 'express'
import { CalendarRouter, PingRouter } from './routers'

const ServerApplication = () => {
    const server = express()
    server.use(express.json())
    server.use(CalendarRouter())
    server.use(PingRouter())
    server.listen(3000, () => console.log('Running on server on port 3000!'))
    return server
}
export { ServerApplication }
