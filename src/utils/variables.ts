import { Env } from "./env";

export const TOKEN = Env.Required('token').ToString();
export const BOT_ID = Env.Required('bot_id').ToString();
export const BOT_PORT = Env.Required('bot_port').ToString();
export const BOT_URL = Env.Required('bot_url').ToString();
export const AUTHORIZATION = Env.Required('authorization').ToString();
export const REST_PORT = Env.Required('rest_port').ToString();
export const REST_URL = Env.Required('rest_url').ToString();
export const GATEWAY_PORT = Env.Required('gateway_port').ToString();
export const GATEWAY_URL = Env.Required('gateway_url').ToString();
export const SHARD_SERVER_PORT = Env.Required('shard_server_port').ToString();
export const SHARD_SERVER_URL = Env.Required('shard_server_url').ToString();
export const EVENT_SERVER_PORT = Env.Required('event_server_port').ToString();
export const EVENT_SERVER_URL = Env.Required('event_server_url').ToString();
export const SERVER_PORT = Env.Required('server_port').ToString();
export const SERVER_URL = Env.Required('server_url').ToString();