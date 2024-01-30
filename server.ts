import express from 'express'
import bodyParser from 'body-parser'
import { CommandHandler, PayEventDto } from './command-handlers/types'
import { QueryHandler } from './query-handler'

export const serverFactory = (payCommandHandler: CommandHandler<PayEventDto>, queryHandler: QueryHandler) => {
  const app = express()
  app.use(bodyParser.json())

  app.get('/balance', (req, res) => {
    const user = req.query.user
    const balance = queryHandler.getBalance(user as string)

    res.json({ balance })
  })

  app.get('/bank', (req, res) => {
    const user = req.query.user
    const balance = queryHandler.getBankBalance()

    res.json({ balance })
  })

  app.get('/history', (req, res) => {
    const user = req.query.user
    const balance = queryHandler.getHistory(user as string)
    
    res.json({ balance })
  })

  app.get('/get-one', (req, res) => {
    const uuid = req.query.uuid
    const event = queryHandler.getOne(uuid as string)
    
    res.json({ event })
  })

  app.post('/pay', async (req, res) => {
    const command = req.body
    const uuid = await payCommandHandler.handle(command)
    
    res.json({ uuid })
  })
  
  return app
}