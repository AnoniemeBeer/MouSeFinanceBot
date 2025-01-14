import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity";
import calculateSubscriptionTotal from "../../utils/calculateSubscriptionTotal";

export default {
    name: "totaal",
    description: "Krijg alle uitgaven van een persoon te zien",
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: "persoon",
            description: "De persoon waarvan je de aankopen wilt zien",
            type: ApplicationCommandOptionType.User,
        },
    ],

    callback: async (client: any, interaction: any) => {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const person: User = interaction.options.getUser("persoon");

            // Get the user and their purchases
            let user: any = null;
            if (person == null) {
                user = await userRepository.findOne({
                    where: { discordId: interaction.user.id },
                    relations: ["purchases", "subscriptions"],
                });
            } else {
                user = await userRepository.findOne({
                    where: { discordId: `${person.id}` },
                    relations: ["purchases", "subscriptions"],
                });
            }

            const totalPurchases = user.purchases.reduce(
                (acc: number, purchase: any) => {
                    return acc + parseFloat(purchase.price);
                },
                0
            );

            const totalSubscriptions = user.subscriptions.reduce(
                (acc: number, subscription: any) => {
                    return (
                        acc +
                        calculateSubscriptionTotal(
                            parseFloat(subscription.price),
                            subscription.recurrence,
                            subscription.startDate
                        )
                    );
                },
                0
            );

            const embed = new EmbedBuilder();
            embed.setTitle("Totaal uitgaven");
            embed.setDescription("Hier zie je alle uitgaven van een persoon.");
            embed.setColor("#53fc0b");
            embed.addFields(
                {
                    name: "Totaal",
                    value: `${totalSubscriptions + totalPurchases}`,
                },
                { name: "Totaal aankopen", value: `${totalPurchases}` },
                {
                    name: "Totaal abbonementen",
                    value: `${totalSubscriptions}`,
                }
            );

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            interaction.reply({
                content: "Er ging iets mis",
                ephemeral: true,
            });
            throw new Error("Error in total expenses callback: " + error);
        }
    },
};
