import { Application, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { User, Purchase, Subscription } from "../../entity";
import { AppDataSource } from "../../data-source";
import { EMBED_COLOR } from "../../utils/constants";

export default {
    name: "abonnement",
    description: "Registreer een abonnement",
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: "prijs",
            description: "De prijs van het abonnement in euro's (bijvoorbeeld: 19.99)",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "herhaling",
            description:
                "De frequentie van het abonnement. Kies uit: dagelijks, wekelijks, maandelijks of jaarlijks.",
            choices: [
                { name: "Dagelijks", value: "dagelijks" },
                { name: "Wekelijks", value: "wekelijks" },
                { name: "Maandelijks", value: "maandelijks" },
                { name: "Jaarlijks", value: "jaarlijks" },
            ],
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "beschrijving",
            description: "Een korte omschrijving van het abonnement (bijvoorbeeld: 'Netflix').",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "start-datum",
            description: "De begindatum van het abonnement in het formaat YYYY-MM-DD (bijvoorbeeld: 2025-01-01).",
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "persoon",
            description: "De gebruiker die verantwoordelijk is voor de aankoop van het abonnement.",
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
                subscription.startDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1
                    }-${startDate.getDate()}`;

                // Save the subscription
                const result = await subscriptionRepository.save(subscription);

                // Create the embed
                const embed = new EmbedBuilder()
                    .setColor(EMBED_COLOR)
                    .setTitle("Abonnement toegevoegd")
                    .setDescription(`Hier vind je de details van het nieuwe abonnement van **${subscription.user.name}**:`)
                    .addFields(
                        { name: "Startdatum", value: startDate.toDateString(), inline: true },
                        { name: "Prijs", value: '€ ' + price, inline: true },
                        { name: "Herhaling", value: recurrence, inline: true },
                        { name: "Beschrijving", value: description, inline: true },
                    )
                    .setFooter({
                        text: "Abonnementen beheer",
                    })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });

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
