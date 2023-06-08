import { EmbedBuilder } from 'discord.js';

export default {
    name: 'embed',
    description: 'Sends an embed!',
    devOnly: true,
    testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    callback: (client:any , interaction:any) => {
        // Create a new embed
        const embed = new EmbedBuilder();
        // Adding properties to the embed
        embed.setTitle('This is an embed!');
        embed.setDescription('This is the description of the embed!');
        embed.setColor('#FF0000');

        // Reply the embed to sender
        interaction.reply({ embeds: [embed] });
    }
}