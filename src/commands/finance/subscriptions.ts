import { Application, ApplicationCommandOptionType } from "discord.js";
import { User, Purchase, Subscription } from "../../entity";
import { AppDataSource } from "../../data-source";

export default {
    name: "abbonementen",
    description: "Bekijk alle abbonementen van een persoon",
    devOnly: false,
    testOnly: true,
    options: [
        {
            name: "persoon",
            description: "De persoon die de aankoop heeft gedaan",
            type: ApplicationCommandOptionType.User,
        },
    ],

    callback: async (client: any, interaction: any) => {
        interaction.reply({
            content: "Deze functie is nog niet geïmplementeerd",
            ephemeral: true,
        });
    },
};
