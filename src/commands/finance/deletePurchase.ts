import { ApplicationCommandOptionType } from 'discord.js';

export default {
    name: 'verwijder-aankoop',
    description: 'Verwijder een aankoop',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'purchase_id',
            description: "Het id van de aankoop die je wilt verwijderen, gebruik /aankopen om de id's te zien",
            type: ApplicationCommandOptionType.Number,
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