## CF Worker for Telegram Notifications

### Purpose

Convenient bot to faciliate ChatOps & deliver notifications from web services to any telegram group or DM. When added to a group or PM, the bot will send you the chat_id. This saves you the time of having to identify the `chat_id` of your various groups.
This worker also provides an endpoint where an API or web service can make a `POST` request with the `chat_id` and `text` (message) params in the body that will be delivered via the telegram bot without having to embed the telegram bot token in the web services.

### Deployment Guide
1. Create telegram bot via BotFather. Setup a command via BotFather `/start`
2. Deploy the Cloudflare worker with Wrangler, set the ENV Variable into CF as per ENV Variable section.
3. `wrangler publish` and set the webhook address of telegram to the worker endpoint or your custom domain binding via `https://api.telegram.org/bot{my_bot_token}/setWebhook?url={CF_Worker_URL/newMessage}`.
### User Guide
1. Add the bot to any group or start a personal chat.
2. Send the /start command, the bot will reply with the chat's ID `chat_id`
3. From any web service, make a `POST` request to the worker `https://<worker-url>/send`. Include the body `{"chat_id":"<chat_id>,", "text": "<any message>"}`

### ENV Variables
Run `wrangler secret put <BOT_TOKEN> <VALUE>` for the telegram Bot Token provided by Bot Father.
