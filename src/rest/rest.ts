import { createRestManager } from '@discordeno/rest'
import { TOKEN } from '../utils/variables'

export const rest = createRestManager({
  token: TOKEN,
})