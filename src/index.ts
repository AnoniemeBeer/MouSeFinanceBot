import { AppDataSource } from "./data-source"
import "reflect-metadata";

import { Client, IntentsBitField, ActivityType, ActivityOptions } from 'discord.js';
import * as dotenv from 'dotenv';

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

const test = async() => {
    await AppDataSource.initialize()
    .then(async () => {
        console.log("Database connection established");
    })
    .catch(error => console.log(error));
}

test();

eventHandler(client);

// Login the client
client.login(
    config.CLIENT_TOKEN
    );
    
