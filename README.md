# MouSeFinanceBot

1. Download the repository.
2. Prepare your `.env` file.
3. Create your Discord app for an API token and put that in the .env file.
4. Run `lando start`.

The app should now be running and, if your .env file is complete with correct settings, you should see the app add the new commands to your server.
> Note: This will only happen the first time running the app.

## Morning embed message

Use `/ochtendbericht` to configure one daily morning embed per Discord server. The command lets a server manager choose the target channel, title, description, optional image URL, and whether the message is enabled.

The bot sends enabled morning embeds once per day at a random time between 07:00 and 09:00. By default this window uses the `Europe/Brussels` time zone. Set `MORNING_EMBED_TIME_ZONE` in `.env` to another IANA time zone, for example `America/New_York`, if your server should use a different morning window.
