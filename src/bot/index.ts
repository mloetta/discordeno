import express from 'express'
import { bot } from './bot'
import { AUTHORIZATION, BOT_PORT, BOT_URL } from '../utils/variables'

const app = express()

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

app.all('/*path', async (req, res) => {
  if (!AUTHORIZATION || AUTHORIZATION !== req.headers.authorization) {
    return res.status(401).json({ error: 'Invalid authorization key.' })
  }

  try {
    bot.events.raw?.(req.body.payload, req.body.shardId)

    if (req.body.data.t) {
      // @ts-ignore
      bot.handlers[req.body.data.t]?.(bot, req.body.payload, req.body.shardId)
    }

    res.status(200).json({ success: true })
  } catch (error: any) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.listen(BOT_PORT, () => {
  console.log(`BOT listening at ${BOT_URL}`)
})