import { createRestManager } from "discordeno";
import { AUTHORIZATION, REST_URL, TOKEN } from "../utils/variables";

export const rest = createRestManager({
  token: TOKEN,
  proxy: {
    baseUrl: REST_URL,
    authorization: AUTHORIZATION
  }
})