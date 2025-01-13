import {
    Application,
    ApplicationCommandOptionType,
    EmbedBuilder,
} from "discord.js";
import { User, Purchase, Subscription } from "../../entity";
import { AppDataSource } from "../../data-source";
import chunkArray from "../../utils/chunkArray";
import pagination from "../../utils/pagination";

export default {
    name: "abbonementen",
    description: "Bekijk alle abbonementen van een persoon",
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: "persoon",
            description: "De persoon die de aankoop heeft gedaan",
            type: ApplicationCommandOptionType.User,
        },
    ],

    callback: async (client: any, interaction: any) => {
        try {
            // Initialize the repositories
            const subscriptionRepository =
                AppDataSource.getRepository(Subscription);
            const userRepository = AppDataSource.getRepository(User);
            const person: User = interaction.options.getUser("persoon");

            // Get the user and their Subscriptions
            let user: any = null;
            if (person == null) {
                user = await userRepository.findOne({
                    where: { discordId: interaction.user.id },
                    relations: ["subscriptions"],
                });
            } else {
                user = await userRepository.findOne({
                    where: { discordId: `${person.id}` },
                    relations: ["subscriptions"],
                });
            }

            // Check if the user has any purchases, if not return a message to the user
            if (user == null || user.subscriptions.length == 0) {
                interaction.reply({
                    content:
                        "Deze persoon heeft nog geen abbonementen geregistreerd",
                    ephemeral: true,
                });
                return;
            }

            // Split the purchases into chunks of 10
            const splitArray: Subscription[][] = chunkArray(
                user.subscriptions,
                10
            );

            // Loop through all the chunks and create an embed for each chunk
            // Create the embeds array that will hold all the embeds
            const embeds: EmbedBuilder[] = [];

            // Loop through all the chunks
            for (const userSubscriptions of splitArray) {
                // Create the an embed
                // Create the fields for the embed
                let ids: string = ``;
                let names: string = ``;
                let prices: string = ``;

                // Loop through all the purchases and add them to the fields
                for (const item of userSubscriptions) {
                    ids += `${item.id}\n`;
                    names += `${item.name}\n`;
                    prices += `€${item.price}\n`;
                }

                // Create the embed
                const embed = new EmbedBuilder();
                embed.setTitle("abbonementen");
                embed.setDescription(
                    `Dit zijn de abbonementen van ${user.name}`
                );
                embed.setColor("#53fc0b");
                embed.addFields(
                    { name: "ID", value: ids, inline: true },
                    {
                        name: "Beschrijving",
                        value: names,
                        inline: true,
                    },
                    { name: "Prijs", value: prices, inline: true }
                );

                // Add the embed to the embeds array
                embeds.push(embed);
            }

            // Send the embeds to the user
            await pagination(interaction, embeds);
        } catch (error) {
            interaction.reply({
                content: "Er ging iets mis bij het ophalen van de abbonementen",
                ephemeral: true,
            });
            throw new Error("Error in subscriptions callback: " + error);
        }
    },
};
