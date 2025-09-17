import express from "express";
import { Worker } from 'worker_threads'
import { Collection } from "discordeno";
import { AUTHORIZATION, SHARD_SERVER_PORT, SHARD_SERVER_URL } from "../../utils/variables";
import { join } from "path";

const WORKERS = new Collection<number, Worker>()

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
    // Identify shard
    switch (req.body.type) {
      case 'IDENTIFY_SHARD': {
        const workerId = Math.floor(req.body.shardId / 10)
        let worker = WORKERS.get(workerId);

        if (!worker) {
          worker = new Worker(join(__dirname, './worker.ts'), { workerData: { workerId } })

          WORKERS.set(workerId, worker)
        }

        worker.postMessage(req.body)

        return res.status(200).send()
      }
      default: {
        console.error(`[Sharding Master] Unknown request received. ${JSON.stringify(req.body)}`)

        return res.status(404).json({ message: 'Unknown request received.', status: 404 })
      }
    }
  } catch (e) {
    console.error(e)

    res.status(500).json(e)
  }
})

app.listen(SHARD_SERVER_PORT, () => {
  console.log(`[Sharding Master] Listening at ${SHARD_SERVER_URL}`)
})