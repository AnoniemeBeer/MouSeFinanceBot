import { ApplicationCommandOptionType } from "discord.js";
import { User, Subscription } from "../../entity";
import { AppDataSource } from "../../data-source";

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

            await subscriptionRepository.delete(subscriptionId);

            interaction.reply({
                content: `De aankoop \`${subscription.name}\`(€${subscription.price}) van \`${subscription.user.name}\` is verwijderd.`,
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
