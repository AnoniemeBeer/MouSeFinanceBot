import { Application, ApplicationCommandOptionType } from "discord.js";
import { User, Purchase, Subscription } from "../../entity";
import { AppDataSource } from "../../data-source";

export default {
    name: "abbonement",
    description: "Registreer een abbonement",
    devOnly: false,
    testOnly: false,
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
        const purchaseRepository = AppDataSource.getRepository(Purchase);
        const userRepository = AppDataSource.getRepository(User);
        const subscriptionRepository =
            AppDataSource.getRepository(Subscription);

        let user = interaction.options.getUser("persoon");
        const price = interaction.options.getNumber("prijs");
        const description = interaction.options.getString("beschrijving");
        const recurrence = interaction.options.getString("herhaling");
        const startDate = interaction.options.getString("start-datum")
            ? new Date(interaction.options.getString("start-datum"))
            : new Date();

        if (user == null) {
            user = interaction.user;
        }

        let userResult: User | null = await userRepository.findOne({
            where: { discordId: user.id },
        });

        // Check if the user exists, if not, create it
        // Otherwise, check if the user's name has changed
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
            console.log(subscription, subscription.startDate);

            // Save the subscription
            try {
                const result = await subscriptionRepository.save(subscription);
                interaction.reply(
                    `Het abonnement is toegevoegd voor \`${
                        user.username
                    }\`, startdatum: \`${startDate.toDateString()}\` prijs: \`${price}\` herhaling: \`${recurrence}\` beschrijving: \`${description}\``
                );
            } catch (error) {
                interaction.reply({
                    content: "Er ging iets mis, aankoop niet geregistreerd",
                    ephemeral: true,
                });
                console.log(error);
            }

            return;
        }

        interaction.reply({
            content: "Er ging iets mis, aankoop niet geregistreerd",
            ephemeral: true,
        });
    },
};
