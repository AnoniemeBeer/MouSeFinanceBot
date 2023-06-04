import {SlashCommandBuilder} from "discord.js";
import { Command } from "../../types";
import { command } from "../../utils/command";

const meta = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .addStringOption((option) => 
        option
            .setName('message')
            .setDescription('Provide the bot a message to reply with')
            .setMinLength(1)
            .setMaxLength(2000)
            .setRequired(false)
    );

export default command(meta, ({ interaction }) => {
    const message = interaction.options.getString('message')

    return interaction.reply({
        ephemeral: true,
        content: message ?? 'Pong!',
    })
})