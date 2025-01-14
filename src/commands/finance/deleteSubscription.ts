import { ApplicationCommandOptionType } from "discord.js";
import { User, Subscription, Purchase } from "../../entity";
import { AppDataSource } from "../../data-source";
import calculateSubscriptionTotal from "../../utils/calculateSubscriptionTotal";

export default {
    name: "verwijder-abbonement",
    description: "Verwijder een abbonement",
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: "abbonement_id",
            description:
                "Het id van de abbonement dat je wilt verwijderen, gebruik /abbonementen om de id's te zien",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    // deleted: Boolean,

    callback: async (client: any, interaction: any) => {
        try {
            const subscriptionRepository =
                AppDataSource.getRepository(Subscription);
            const purchaseRepository = AppDataSource.getRepository(Purchase);
            const subscriptionId =
                interaction.options.getNumber("abbonement_id");

            const subscription = await subscriptionRepository.findOne({
                where: { id: subscriptionId },
                relations: ["user"],
            });

            if (subscription == null) {
                interaction.reply({
                    content: "Dit abbonement bestaat niet",
                    ephemeral: true,
                });
                return;
            }

            if (interaction.user.id !== subscription.user.discordId) {
                interaction.reply({
                    content: "Je kan alleen je eigen abbonementen verwijderen",
                    ephemeral: true,
                });
                return;
            }

            // Delete the subscription
            const total = calculateSubscriptionTotal(
                subscription.price,
                subscription.recurrence,
                subscription.startDate
            );
            const purchase = new Purchase();
            purchase.user = subscription.user;
            purchase.price = total;
            purchase.description = `Verwijderd abbonement: ${subscription.name} (€${subscription.price} ${subscription.recurrence})`;

            await purchaseRepository.save(purchase);
            await subscriptionRepository.delete(subscriptionId);

            interaction.reply({
                content: `Het abbonement \`${subscription.name}\`(€${subscription.price} ${subscription.recurrence}) van \`${subscription.user.name}\` is verwijderd.`,
            });
        } catch (error) {
            interaction.reply({
                content: "Er is iets fout gegaan, probeer het later opnieuw",
                ephemeral: true,
            });
            throw new Error("Error while deleting subscription: " + error);
        }
    },
};
