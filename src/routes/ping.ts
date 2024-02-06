import { Router } from 'express'

export const pingRouter = Router()

pingRouter.get('', async (req, res) => {
  res.send('pong')
})
