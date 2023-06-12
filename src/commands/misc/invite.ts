import { EmbedBuilder } from 'discord.js';

export default {
    name: 'invite',
    description: 'Sends invite link!',
    // devOnly: true,
    // testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    callback: (client:any , interaction:any) => {
        interaction.reply({
            content: "https://discord.com/api/oauth2/authorize?client_id=1114892199994347520&permissions=8&scope=bot",
            ephemeral: true,
        });
    }
}