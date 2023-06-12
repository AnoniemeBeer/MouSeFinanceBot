import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'aankopen',
    description: 'Krijgt alle aankopen van een persoon te zien',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'persoon',
            description: "De persoon waarvan je de aankopen wilt zien",
            type: ApplicationCommandOptionType.User,
            required: true, 
        },
    ],
    // deleted: Boolean,
    
    callback: (client:any , interaction:any) => {
        interaction.reply(
            {
                content: `Moet nog geimplementeerd worden`,
                ephemeral: true,
            }
        );
    }
}