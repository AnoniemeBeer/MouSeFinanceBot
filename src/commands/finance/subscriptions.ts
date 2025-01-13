import { Application, ApplicationCommandOptionType } from "discord.js";
import { User, Purchase, Subscription } from "../../entity";
import { AppDataSource } from "../../data-source";

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
            if (user == null || user.purchases.length == 0) {
                interaction.reply({
                    content: "Deze persoon heeft nog geen aankopen gedaan",
                    ephemeral: true,
                });
                return;
            }

            // Return a message
            interaction.reply({
                content: "Deze functie is nog niet geïmplementeerd",
                ephemeral: true,
            });
        } catch (error) {
            interaction.reply({
                content: "Er ging iets mis bij het ophalen van de abbonementen",
                ephemeral: true,
            });
            throw new Error("Error in subscriptions callback: " + error);
        }
    },
};
