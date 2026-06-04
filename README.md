# MouSeFinanceBot

1. Download the repository.
2. Prepare your `.env` file.
3. Create your Discord app for an API token and put that in the .env file.
4. Run `lando start`.

The app should now be running and, if your .env file is complete with correct settings, you should see the app add the new commands to your server.
> Note: This will only happen the first time running the app.

## Morning embed message

Use `/ochtendbericht` to send a fixed embed to a selected channel. The embed title is `tijgerinnetje`, the description is `Goeiemorgen`, and the footer contains the ZenQuotes quote of the day from `https://zenquotes.io/api/today`.
