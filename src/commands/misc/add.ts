import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'add',
    description: 'Adds two numbers',
    devOnly: true,
    testOnly: true,
    options: [
                    {
                name: 'first_number',
                description: 'The first number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'second_number',
                description: 'The second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
    ],
    // deleted: Boolean,

    callback: (client:any , interaction:any) => {
        const firstNumber = interaction.options.getNumber('first_number');
        const secondNumber = interaction.options.getNumber('second_number');

        interaction.reply(`The sum is ${firstNumber + secondNumber}`);
    }
}