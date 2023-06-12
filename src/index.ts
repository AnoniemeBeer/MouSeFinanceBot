// import { AppDataSource } from "./data-source"

// import { Client, IntentsBitField } from 'discord.js';
// import * as dotenv from 'dotenv';

// import eventHandler from './handlers/eventHandler';

// const config: dotenv.DotenvParseOutput|undefined = dotenv.config().parsed || {};

// // Create the client and add the rights it needs/has
// const client = new Client({
//     intents: [
//         IntentsBitField.Flags.Guilds,
//         IntentsBitField.Flags.GuildMembers,
//         IntentsBitField.Flags.GuildMessages,
//         IntentsBitField.Flags.MessageContent,
//     ]
// });

// eventHandler(client);

// // Login the client
// client.login(
//     config.CLIENT_TOKEN
// );

import { AppDataSource } from "./data-source"
import { User, Purchase } from "./entity";
import "reflect-metadata";



async function test() {
    
    await AppDataSource.initialize()
    .then(async () => {
        console.log("Database connection established");
    })
    .catch(error => console.log(error));

    const userRepository = AppDataSource.getRepository(User);
    const purchaseRepository = AppDataSource.getRepository(Purchase);

    // const allUsers = await userRepository.findOneBy({ id: 1 });

    // const purchase: Purchase = new Purchase();

    // if (allUsers){
    //     purchase.description = "Test purchase";
    //     purchase.price = 100;
    //     purchase.user = allUsers;
    // }

    // await purchaseRepository.save(purchase);

    const allPurchases = await purchaseRepository.find({
        relations: ["user"]
    });

    console.log(allPurchases);
}

test();