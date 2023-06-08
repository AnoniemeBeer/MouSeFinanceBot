import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'aankoop',
    description: 'Registreer een aankoop',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'prijs',
            description: "De prijs van de aankoop",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'beschrijving',
            description: "Wat was de aankoop",
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'persoon',
            description: "De persoon die de aankoop heeft gedaan",
            type: ApplicationCommandOptionType.User,
        },
    ],
    // deleted: Boolean,
    
    callback: (client:any , interaction:any) => {
        const price = interaction.options.getNumber('prijs');
        const description = interaction.options.getString('beschrijving');
        let user = interaction.options.getUser('persoon');
        if (user == null){
            user = interaction.member.user;
        }
        
        interaction.reply(
            {
                content: `Moet nog geimplementeerd worden`,
                ephemeral: true,
            }
        );
    }
}