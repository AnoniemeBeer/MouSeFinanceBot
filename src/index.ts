import { AppDataSource } from "./data-source";

import {
  Client,
  IntentsBitField,
  ActivityType,
  ActivityOptions,
} from "discord.js";
import dotenv from "dotenv";

import eventHandler from "./handlers/eventHandler";

dotenv.config();

// Create the client and add the rights it needs/has
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const connectDb = async () => {
  let flag = true;
  let count = 0;
  while (flag) {
    count += 1;
    console.log(`Attempt ${count} to connect to database`);
    await AppDataSource.initialize()
      .then(async () => {
        console.log("Database connection established");
        flag = false;
      })
      .catch((error) => {
        console.log(error);
      });

    // Wait 2 seconds before trying again
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

connectDb();

eventHandler(client);

// Login the client
client.login(process.env.CLIENT_TOKEN);
