import { EmbedBuilder } from 'discord.js';

export default {
    name: 'info',
    description: 'Krijg alle commands te zien',
    devOnly: false,
    testOnly: false,
    // options: Object[],
    // deleted: Boolean,

    callback: (client:any , interaction:any) => {
        // Create a new embed
        const embed = new EmbedBuilder();
        // Adding properties to the embed
        embed.setTitle('This is an embed!');
        embed.setDescription('This is the description of the embed!');
        embed.setColor('#FF0000');

        // Adding fields to the embed
        let commands: string = `leaderboard\naankoop\naankopen\nverwijder-aankoop`;
        let descriptions: string = `Krijg het leaderboard van de server tezien\nRegistreer een aankoop\nKrijgt alle aankopen van een persoon te zien\nVerwijder een aankoop`;

        embed.addFields(
            { name: 'Command', value: commands, inline: true},
            { name: 'Description', value: descriptions, inline: true }
        );

        // Reply the embed to sender
        interaction.reply({ embeds: [embed] });
    }
}