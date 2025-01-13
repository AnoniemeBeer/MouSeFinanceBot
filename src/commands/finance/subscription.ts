import { Application, ApplicationCommandOptionType } from "discord.js";
import { User, Purchase, Subscription } from "../../entity";
import { AppDataSource } from "../../data-source";

export default {
    name: "abbonement",
    description: "Registreer een abbonement",
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: "prijs",
            description: "De prijs van het abbonement",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "herhaling",
            description:
                "Hoe vaak herhaalt het abonnement? (dagelijks, wekelijks, maandelijks, jaarlijks)",
            options: ["dagelijks", "wekelijks", "maandelijks", "jaarlijks"],
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "beschrijving",
            description: "Wat was de aankoop",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "start-datum",
            description: "De start datum van het abonnement (YYYY-MM-DD)",
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "persoon",
            description: "De persoon die de aankoop heeft gedaan",
            type: ApplicationCommandOptionType.User,
        },
    ],

    callback: async (client: any, interaction: any) => {
        try {
            // Initialize the repositories
            const userRepository = AppDataSource.getRepository(User);
            const subscriptionRepository =
                AppDataSource.getRepository(Subscription);

            // Get the command options
            let user = interaction.options.getUser("persoon");
            const price = interaction.options.getNumber("prijs");
            const description = interaction.options.getString("beschrijving");
            const recurrence = interaction.options.getString("herhaling");
            const startDate = interaction.options.getString("start-datum")
                ? new Date(interaction.options.getString("start-datum"))
                : new Date();

            // Check if the user is null
            if (user == null) {
                user = interaction.user;
            }

            // Check if the user exists, if not, create it
            // Otherwise, check if the user's name has changed
            let userResult: User | null = await userRepository.findOne({
                where: { discordId: user.id },
            });

            if (userResult == null) {
                const newUser = new User();
                newUser.discordId = user.id;
                newUser.name = user.username;

                await userRepository.save(newUser);

                userResult = await userRepository.findOne({
                    where: { discordId: user.id },
                });
            } else {
                // First check if the user's name has changed
                if (userResult.name != user.username) {
                    userResult.name = user.username;
                    userResult.discordId = user.id;
                    await userRepository.save(userResult);
                }
            }

            if (userResult) {
                // Create a new subscription
                const subscription = new Subscription();
                subscription.name = description;
                subscription.price = price;
                subscription.recurrence = recurrence;
                subscription.user = userResult;
                subscription.startDate = `${startDate.getFullYear()}-${
                    startDate.getMonth() + 1
                }-${startDate.getDate()}`;

                // Save the subscription

                const result = await subscriptionRepository.save(subscription);
                interaction.reply(
                    `Het abonnement is toegevoegd voor \`${
                        user.username
                    }\`, startdatum: \`${startDate.toDateString()}\` prijs: \`${price}\` herhaling: \`${recurrence}\` beschrijving: \`${description}\``
                );

                return;
            }
        } catch (error) {
            interaction.reply({
                content: "Er ging iets mis, aankoop niet geregistreerd",
                ephemeral: true,
            });
            throw new Error("Error in subscription callback: " + error);
        }
    },
};
