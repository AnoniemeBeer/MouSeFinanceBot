import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default {
    name: 'ban',
    description: 'bans a member from the server.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // deleted: Boolean,

    options: [
        {
            name: 'target-user',
            description: 'Bans a user from the server',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for banning the user',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: (client:any , interaction:any) => {
        interaction.reply(`ban...`);
    }
}