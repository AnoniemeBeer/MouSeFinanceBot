const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');
const dotenv = require('dotenv')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (c: { user: { tag: any; }; }) => {
    console.log(`Logged in as ${c.user.tag}!`);

    setInterval(() => {
        let random = Math.floor(Math.random() * statuses.length);
        client.user.setActivity(statuses[random]);
    }, 100000 )
});

let statuses = [
    {
        name: 'The mouse',
        type: ActivityType.Watching,
    },
];

client.on('interactionCreate', (interaction: any) => {
    if (!interaction.isCommand()) return;
    
    if (interaction.commandName === 'hey') {
        interaction.reply(`Hey ${interaction.member.user.id}!`);
    }

    if (interaction.commandName === 'add') {
        const firstNumber = interaction.options.getNumber('first_number');
        const secondNumber = interaction.options.getNumber('second_number');

        interaction.reply(`The sum is ${firstNumber + secondNumber}`);
    }

    if (interaction.commandName === 'embed') {
        const embed = new EmbedBuilder();
        embed.setTitle('This is an embed!');
        embed.setDescription('This is the description of the embed!');
        embed.setColor('#FF0000');

        interaction.reply({ embeds: [embed] });
    }
});

client.login(
    dotenv.config().parsed.CLIENT_TOKEN
);