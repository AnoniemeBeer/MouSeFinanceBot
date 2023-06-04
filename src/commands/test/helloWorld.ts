import {Client, SlashCommandBuilder} from "discord.js";
import { Command } from "../../types";
import { command } from "../../utils/command";

const meta = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Get nice responses from the bot');

export default command(meta, ({ interaction }) => {

    return interaction.reply({
        ephemeral: true,
        content: `Hello ${meta}!`,
    })
})