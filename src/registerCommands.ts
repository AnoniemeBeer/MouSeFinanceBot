const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
const dotenv = require('dotenv')

const  commands = [
    {
        name: 'hey',
        description: 'Replies with hey!'
    }, 
    {
        name: 'add',
        description: 'Adds two numbers',
        options: [
            {
                name: 'first_number',
                description: 'The first number',
                type: ApplicationCommandOptionType.Number,
                required: true,
                choices: [
                    {
                        name: 'one',
                        value: 1,
                    },
                    {
                        name: 'two',
                        value: 2,
                    },
                    {
                        name: 'three',
                        value: 3,
                    },
                ]
            },
            {
                name: 'second_number',
                description: 'The second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ]
    }, 
    {
        name: 'embed',
        description: 'Sends an embed!'
    }, 
];

const rest = new REST({ version: '10' }).setToken(dotenv.config().parsed.CLIENT_TOKEN);

(async () => {
    try {
        console.log('Registrering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(dotenv.config().parsed.CLIENT_ID, dotenv.config().parsed.GUILD_ID),
            {
                body: commands,
            }
        )

        console.log('Successfully registered application commands')
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
})();