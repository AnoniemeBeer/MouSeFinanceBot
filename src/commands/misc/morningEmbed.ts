import {
    ApplicationCommandOptionType,
    AttachmentBuilder,
    ChannelType,
    EmbedBuilder,
    PermissionsBitField,
} from "discord.js";
import { get } from "https";
import path from "path";

type ZenQuote = {
    q: string;
    a: string;
};

const ZEN_QUOTES_TODAY_URL = "https://zenquotes.io/api/today";
const MORNING_IMAGE_NAME = "tijgerinnetje.webp";

const fetchDailyQuote = async (): Promise<ZenQuote | null> =>
    new Promise((resolve) => {
        get(ZEN_QUOTES_TODAY_URL, (response) => {
            let body = "";

            response.on("data", (chunk) => {
                body += chunk;
            });

            response.on("end", () => {
                try {
                    const quotes = JSON.parse(body);
                    const quote = Array.isArray(quotes) ? quotes[0] : null;

                    if (quote?.q && quote?.a) {
                        resolve({ q: quote.q, a: quote.a });
                        return;
                    }

                    resolve(null);
                } catch {
                    resolve(null);
                }
            });
        }).on("error", () => {
            resolve(null);
        });
    });

export default {
    name: "ochtendbericht",
    description: "Verstuur een ochtendbericht met vaste inhoud",
    devOnly: false,
    testOnly: false,
    permissionsRequired: [PermissionsBitField.Flags.ManageGuild],
    botPermissions: [
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.EmbedLinks,
    ],
    options: [
        {
            name: "kanaal",
            description: "Het kanaal waar het ochtendbericht naartoe moet",
            type: ApplicationCommandOptionType.Channel,
            channel_types: [
                ChannelType.GuildText,
                ChannelType.GuildAnnouncement,
            ],
            required: true,
        },
    ],

    callback: async (client: any, interaction: any) => {
        if (!interaction.guildId) {
            await interaction.reply({
                content:
                    "Dit commando kan alleen in een server gebruikt worden.",
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.options.getChannel("kanaal");
        const dailyQuote = await fetchDailyQuote();
        const image = new AttachmentBuilder(
            path.join(
                __dirname,
                "..",
                "..",
                "..",
                "assets",
                MORNING_IMAGE_NAME,
            ),
        );

        const previewEmbed = new EmbedBuilder()
            .setTitle("tijgerinnetje")
            .setDescription("Goeiemorgen")
            .setColor("#53fc0b")
            .setImage(`attachment://${MORNING_IMAGE_NAME}`);

        if (dailyQuote) {
            previewEmbed.setFooter({
                text: `${dailyQuote.q} - ${dailyQuote.a}`,
            });
        }

        await channel.send({ embeds: [previewEmbed], files: [image] });

        await interaction.editReply({
            content: `Het ochtendbericht is verzonden in ${channel}.`,
        });
    },
};
