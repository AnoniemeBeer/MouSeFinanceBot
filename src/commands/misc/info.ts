import { EmbedBuilder } from 'discord.js';

export default {
    name: 'info',
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
        embed.setFooter({ text: 'Shame on you all'});
        const userNames: string = "\`1:\` anoniemebeer\n\`2:\` pippeloo";
        const totals: string = "€50\n€10";
        embed.addFields(
            { name: 'Top 10', value: userNames, inline: true},
            { name: 'Total', value: totals, inline: true }
        );

        // Reply the embed to sender
        interaction.reply({ embeds: [embed] });
    }
}