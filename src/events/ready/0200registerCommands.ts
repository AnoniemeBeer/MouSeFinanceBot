import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';
import dotenv from 'dotenv';
import getLocalCommands from '../../utils/getLocalCommands';
import getApplicationCommands from '../../utils/getApplicationCommands';
import areCommandsDifferent from '../../utils/areCommandsDifferent';

export default async (client: any) => {
    const config: dotenv.DotenvParseOutput | undefined = dotenv.config().parsed || {};
    
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, config.GUILD_ID);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;
            const existingCommand = await applicationCommands.cache.find((cmd: any) => cmd.name === name);

            if (existingCommand) {
                if(localCommand.deleted){
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command ${name}`);
                    continue;
                }

                if(areCommandsDifferent(existingCommand, localCommand)){
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });
                    console.log(`Updated command ${name}`);

                }
            } else {
                if (localCommand.deleted){
                    console.log(`skipping registeren command ${name} as it is set to delete.`);
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                })

                console.log(`Registered command ${name}`);
            }
        }
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
};

// const  commands = [
//     {
//         name: 'hey',
//         description: 'Replies with hey!'
//     }, 
//     {
//         name: 'add',
//         description: 'Adds two numbers',
//         options: [
//             {
//                 name: 'first_number',
//                 description: 'The first number',
//                 type: ApplicationCommandOptionType.Number,
//                 required: true,
//                 choices: [
//                     {
//                         name: 'one',
//                         value: 1,
//                     },
//                     {
//                         name: 'two',
//                         value: 2,
//                     },
//                     {
//                         name: 'three',
//                         value: 3,
//                     },
//                 ]
//             },
//             {
//                 name: 'second_number',
//                 description: 'The second number',
//                 type: ApplicationCommandOptionType.Number,
//                 required: true,
//             },
//         ]
//     }, 
//     {
//         name: 'embed',
//         description: 'Sends an embed!',
//     }, 
//     {
//         name: 'leaderboard',
//         description: 'Krijgt het leaderboard van de server tezien',
//     },
//     {
//         name: 'aankoop',
//         description: 'Registreer een aankoop',
//         options: [
//             {
//                 name: 'prijs',
//                 description: "De prijs van de aankoop",
//                 type: ApplicationCommandOptionType.Number,
//                 required: true,
//             },
//             {
//                 name: 'beschrijving',
//                 description: "Wat was de aankoop",
//                 type: ApplicationCommandOptionType.String,
//             },
//             {
//                 name: 'persoon',
//                 description: "De persoon die de aankoop heeft gedaan",
//                 type: ApplicationCommandOptionType.User,
//             },
//         ],
//     },
//     {
//         name: 'aankopen',
//         description: 'Krijgt alle aankopen van een persoon te zien',
//         options: [
//             {
//                 name: 'persoon',
//                 description: "De persoon waarvan je de aankopen wilt zien",
//                 type: ApplicationCommandOptionType.User,
//                 required: true, 
//             },
//         ],
//     }
// ];

// const rest = new REST({ version: '10' }).setToken(config?config.CLIENT_TOKEN:"");

// (async () => {
//     try {
//         console.log('Registrering slash commands...');

//         await rest.put(
//             Routes.applicationGuildCommands(config?config.CLIENT_ID:"", config?config.GUILD_ID:""),
//             {
//                 body: commands,
//             }
//         )

//         console.log('Successfully registered application commands')
//     } catch (error) {
//         console.error(`There was an error: ${error}`);
//     }
// })();