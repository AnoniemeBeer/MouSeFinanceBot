import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { User, Purchase } from "../../entity";
import { AppDataSource } from "../../data-source";
import pagination from "../../utils/pagination";
import chunkArray from "../../utils/chunkArray";

export default {
    name: "aankopen",
    description: "Krijg alle aankopen van een persoon te zien",
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: "persoon",
            description: "De persoon waarvan je de aankopen wilt zien",
            type: ApplicationCommandOptionType.User,
        },
    ],
    // deleted: Boolean,

    callback: async (client: any, interaction: any) => {
        // Initialize the repositories
        const purchaseRepository = AppDataSource.getRepository(Purchase);
        const userRepository = AppDataSource.getRepository(User);
        const person: User = interaction.options.getUser("persoon");

        // Get the user and their purchases
        let user: any = null;
        if (person == null) {
            user = await userRepository.findOne({
                where: { discordId: interaction.user.id },
                relations: ["purchases"],
            });
        } else {
            user = await userRepository.findOne({
                where: { discordId: `${person.id}` },
                relations: ["purchases"],
            });
        }

        // Check if the user has any purchases, if not return a message to the user
        if (user == null || user.purchases.length == 0) {
            interaction.reply({
                content: "Deze persoon heeft nog geen aankopen gedaan",
                ephemeral: true,
            });
            return;
        }

        // Calculate the total amount of money spent
        let total: number = 0;
        for (const item of user.purchases) {
            total += item.price;
        }

        // Split the purchases into chunks of 10
        const splitArray: Purchase[][] = chunkArray(user.purchases, 10);

        // Loop through all the chunks and create an embed for each chunk
        // Create the embeds array that will hold all the embeds
        const embeds: EmbedBuilder[] = [];

        // Loop through all the chunks
        for (const userPurchases of splitArray) {
            // Create the an embed
            // Create the fields for the embed
            let ids: string = ``;
            let beschrijvingen: string = ``;
            let prices: string = ``;

            // Loop through all the purchases and add them to the fields
            for (const item of userPurchases) {
                ids += `${item.id}\n`;
                beschrijvingen += `${item.description}\n`;
                prices += `€${item.price}\n`;
            }

            // Create the embed
            const embed = new EmbedBuilder();
            embed.setTitle("Aankopen");
            embed.setDescription(
                `Dit zijn de aankopen van ${user.name} \nTotale uitgave: €${total}`
            );
            embed.setColor("#53fc0b");
            embed.addFields(
                { name: "ID", value: ids, inline: true },
                { name: "Beschrijving", value: beschrijvingen, inline: true },
                { name: "Prijs", value: prices, inline: true }
            );

            // Add the embed to the embeds array
            embeds.push(embed);
        }

        // Send the embeds to the user
        await pagination(interaction, embeds);
    },
};
