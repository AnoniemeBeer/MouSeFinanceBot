import {
    Application,
    ApplicationCommandOptionType,
    EmbedBuilder,
} from "discord.js";
import { User, Purchase, Subscription } from "../../entity";
import { AppDataSource } from "../../data-source";
import chunkArray from "../../utils/chunkArray";
import pagination from "../../utils/pagination";
import calculateSubscriptionTotal from "../../utils/calculateSubscriptionTotal";
import { EMBED_COLOR } from "../../utils/constants";

export default {
    name: "abonnementen",
    description: "Bekijk alle abonnementen",
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: "persoon",
            description: "De persoon die de aankoop heeft gedaan",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    callback: async (client: any, interaction: any) => {
        try {
            // Initialize the repositories
            const subscriptionRepository =
                AppDataSource.getRepository(Subscription);
            const userRepository = AppDataSource.getRepository(User);
            const person = interaction.options.getUser("persoon");

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
                        "Deze persoon heeft nog geen abonnementen geregistreerd",
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
                let totalSubscriptions: number = 0;

                // Loop through all the purchases and add them to the fields
                for (const item of userSubscriptions) {
                    ids += `${item.id}\n`;
                    names += `${item.name}\n`;
                    prices += `€ ${item.price}\n`;
                    totalSubscriptions += calculateSubscriptionTotal(
                        item.price,
                        item.recurrence,
                        item.startDate
                    );
                }

                // Create the embed
                const embed = new EmbedBuilder()
                    .setColor(EMBED_COLOR)
                    .setTitle("Abonnementen overzicht")
                    .setDescription(`Hier vind je een overzicht van alle abonnementen van **${user.name}**:`)
                    .addFields(
                        { name: "ID", value: ids || "Geen", inline: true },
                        { name: "Beschrijving", value: names || "Geen", inline: true },
                        { name: "Prijs", value: prices || "Geen", inline: true },
                    )
                    .addFields({ name: "Totale kost", value: `€ ${totalSubscriptions}`, inline: false })
                    .setThumbnail(person.displayAvatarURL({ dynamic: true, size: 128 })) // Add user's avatar as a thumbnail
                    .setFooter({
                        text: "Abonnementen beheer",
                    })
                    .setTimestamp();


                // Add the embed to the embeds array
                embeds.push(embed);
            }

            // Send the embeds to the user
            await pagination(interaction, embeds);
        } catch (error) {
            interaction.reply({
                content: "Er ging iets mis bij het ophalen van de abonnementen",
                ephemeral: true,
            });
            throw new Error("Error in subscriptions callback: " + error);
        }
    },
};
