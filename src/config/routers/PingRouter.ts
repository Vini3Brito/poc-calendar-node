import express, { Request, Response } from 'express'

const PingRouter = () => {
    const router = express.Router()

    router.get('/ping', (req: Request, res: Response) => {
        res.send('pong')
    })

    return router
}

export { PingRouter }
