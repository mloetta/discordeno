import express from 'express'
import { gateway } from './gateway';
import { AUTHORIZATION, GATEWAY_PORT, GATEWAY_URL } from '../utils/variables';

const app = express()

app.use(
  express.urlencoded({
    extended: true
  }),
)

app.use(express.json())

app.all('/*path', async (req, res) => {
  if (!AUTHORIZATION || AUTHORIZATION !== req.headers.authorization) {
    return res.status(401).json({ error: 'Invalid authorization key.' })
  }

  try {
    // Identify a shard
    switch (req.body.type) {
      case 'REQUEST_MEMBERS': {
        return await gateway.requestMembers(req.body.guildId, req.body.options)
      }
      default: {
        console.error(`[Shard] Unknown request received. ${JSON.stringify(req.body)}`)

        return res.status(404).json({ message: 'Unknown request received.', status: 404 })
      }
    }
  } catch (e) {
    console.error(e)

    res.status(500).json(e)
  }
})

app.listen(GATEWAY_PORT, () => {
  console.log(`Listening at ${GATEWAY_URL}`)
})