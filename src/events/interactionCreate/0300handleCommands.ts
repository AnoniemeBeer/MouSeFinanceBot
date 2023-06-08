import dotenv from 'dotenv';
import getLocalCommands from '../../utils/getLocalCommands';

export default async (client:any , interaction:any ) => {
    const config: dotenv.DotenvParseOutput = dotenv.config().parsed || {};
    const devs = config.DEVS.split(',');
    const testGuild = config.TEST_GUILD;

    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd:any) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if(commandObject.devOnly){
            if(!devs.includes(interaction.member.id)){
                interaction.reply({
                    content: "Only developers are allowed to run this command.",
                    ephemeral: true,
                });
                return;
            }
        }
        if(commandObject.testOnly){
            if(!(interaction.guild.id === testGuild)){
                interaction.reply({
                    content: "This command cannot be ran in this server.",
                    ephemeral: true,
                });
                return;
            }
        }
        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if(!interaction.member.permissions.has(permission)){
                    interaction.reply({
                        content: "You do not have the required permissions to run this command.",
                        ephemeral: true,
                    });
                    break;
                }
            }
        }
        if(commandObject.botPermissions?.length){
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if(!bot.permissions.has(permission)){
                    interaction.reply({
                        content: "I do not have the required permissions to run this command.",
                        ephemeral: true,
                    });
                    break;
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error) {
        console.log(`There was an error running this command: ${error}`);
    }
};