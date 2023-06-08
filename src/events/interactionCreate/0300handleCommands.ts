import dotenv from 'dotenv';
import getLocalCommands from '../../utils/getLocalCommands';

export default async (client:any , interaction:any ) => {
    const config: dotenv.DotenvParseOutput = dotenv.config().parsed || {};
    const devs = config.DEVS.split(',');
    const testGuild = config.GUILD_ID;

    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd:any) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if(commandObject.devOnly){
            if(!devs.includes(interaction.member.id)){
                interaction.reply({
                    content: "Alleen developers mogel dit commando gebruiken.",
                    ephemeral: true,
                });
                return;
            }
        }
        if(commandObject.testOnly){
            if(!(interaction.guild.id === testGuild)){
                interaction.reply({
                    content: "Dit commando is nog niet beschikbaar op deze server.",
                    ephemeral: true,
                });
                return;
            }
        }
        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if(!interaction.member.permissions.has(permission)){
                    interaction.reply({
                        content: "Je hebt niet de juiste permissies om dit commando te gebruiken.",
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
                        content: "Ik heb niet de juiste permissies om dit commando te gebruiken.",
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