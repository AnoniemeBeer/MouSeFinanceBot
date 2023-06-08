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

// // When the client is ready, this event handler will be called
// // Of course, this is only called once, when the client is ready
// client.on('ready', (c: { user: { tag: any; }; }) => {
//     // Log the client's tag (username#discriminator)
//     console.log(`Logged in as ${c.user.tag}!`);

//     // Set the client's activity to a random status every hour
//     setInterval(() => {
//         let random = Math.floor(Math.random() * statuses.length);
//         client.user.setActivity(statuses[random]);
//     }, 3600000 )
// });

// // An array of the statuses the bot can have
// let statuses = [
//     {
//         name: 'Doe da ni',
//         type: ActivityType.Watching,
//     },
//     {
//         name: 'Tlach aan de setup',
//         type: ActivityType.Watching,
//     },
//     {
//         name: 'Tlag aan den auto',
//         type: ActivityType.Watching,
//     },
//     {
//         name: 'Tlag ni aan mei',
//         type: ActivityType.Watching,
//     },
// ];

// // When the client receives slash command, this event handler will be called
// client.on('interactionCreate', (interaction: any) => {
//     // If the interaction is not a command, return (do nothing)
//     if (!interaction.isCommand()) return;
    
//     // Logic for the 'hey' command
//     if (interaction.commandName === 'hey') {
//         interaction.reply(`Hey ${interaction.member.user.id}!`);
//     }

//     // Logic for the 'add' command
//     if (interaction.commandName === 'add') {
//         const firstNumber = interaction.options.getNumber('first_number');
//         const secondNumber = interaction.options.getNumber('second_number');

//         interaction.reply(`The sum is ${firstNumber + secondNumber}`);
//     }

//     // Logic for the 'embed' command
//     if (interaction.commandName === 'embed') {
//         // Create a new embed
//         const embed = new EmbedBuilder();
//         // Adding properties to the embed
//         embed.setTitle('This is an embed!');
//         embed.setDescription('This is the description of the embed!');
//         embed.setColor('#FF0000');

//         // Reply the embed to sender
//         interaction.reply({ embeds: [embed] });
//     }

//     if (interaction.commandName === 'leaderboard') {
//         interaction.reply(
//             {
//                 content: `Moet nog gemaakt worden`,
//                 ephemeral: true,
//             }
//         );
//     }

//     if (interaction.commandName === 'aankoop') {
//         const price = interaction.options.getNumber('prijs');
//         const description = interaction.options.getString('beschrijving');
//         let user = interaction.options.getUser('persoon');
//         if (user == null){
//             user = interaction.member.user;
//         }

//         interaction.reply(`De aankoop van ${user.id} met een prijs van ${price} euro en een beschrijving van ${description} is geregistreerd!`);
//     }

//     if (interaction.commandName === 'aankopen') {
//         interaction.reply(
//             {
//                 content: `Moet nog gemaakt worden`,
//                 ephemeral: true,
//             }
//         );
//     }
// });

// Login the client
client.login(
    config.CLIENT_TOKEN
);