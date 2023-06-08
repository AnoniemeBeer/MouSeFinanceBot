// Welcome to the code of the MouSeFinanceBot. Please read the README.md file for more information.
// This bot is created for the LaCie_MouSe Discord server.
// Author: Jorn Van Dijck (A.K.A. anonieme_beer)

import { Client, IntentsBitField, EmbedBuilder, ActivityType } from 'discord.js';
import dotenv from 'dotenv';

import eventHandler from './handlers/eventHandler';

const config: dotenv.DotenvParseOutput|undefined = dotenv.config().parsed || {};

// Create the client and add the rights it needs/has
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

eventHandler(client);

// Login the client
client.login(
    config.CLIENT_TOKEN
);