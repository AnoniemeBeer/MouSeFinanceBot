import {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import { AppDataSource } from "../../data-source";
import { MorningEmbed } from "../../entity";

const isValidImageUrl = (imageUrl: string) => {
  try {
    const url = new URL(imageUrl);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export default {
  name: "ochtendbericht",
  description: "Stel het dagelijkse ochtendbericht tussen 7u en 9u in",
  devOnly: false,
  testOnly: false,
  permissionsRequired: [PermissionsBitField.Flags.ManageGuild],
  botPermissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks],
  options: [
    {
      name: "kanaal",
      description: "Het kanaal waar het ochtendbericht naartoe moet",
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      required: true,
    },
    {
      name: "titel",
      description: "De titel van de embed",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "beschrijving",
      description: "De beschrijving van de embed",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "afbeelding",
      description: "Optionele URL van de afbeelding in de embed",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "ingeschakeld",
      description: "Zet het dagelijkse ochtendbericht aan of uit",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],

  callback: async (client: any, interaction: any) => {
    if (!interaction.guildId) {
      interaction.reply({
        content: "Dit commando kan alleen in een server gebruikt worden.",
        ephemeral: true,
      });
      return;
    }

    const channel = interaction.options.getChannel("kanaal");
    const title = interaction.options.getString("titel");
    const description = interaction.options.getString("beschrijving");
    const imageUrl = interaction.options.getString("afbeelding");
    const enabled = interaction.options.getBoolean("ingeschakeld") ?? true;

    if (imageUrl && !isValidImageUrl(imageUrl)) {
      interaction.reply({
        content: "Gebruik een geldige http(s)-URL voor de afbeelding.",
        ephemeral: true,
      });
      return;
    }

    const morningEmbedRepository = AppDataSource.getRepository(MorningEmbed);
    let morningEmbed = await morningEmbedRepository.findOne({
      where: { guildId: interaction.guildId },
    });

    if (!morningEmbed) {
      morningEmbed = new MorningEmbed();
      morningEmbed.guildId = interaction.guildId;
      morningEmbed.lastSentDate = null;
    }

    morningEmbed.channelId = channel.id;
    morningEmbed.title = title;
    morningEmbed.description = description;
    morningEmbed.imageUrl = imageUrl;
    morningEmbed.enabled = enabled;

    await morningEmbedRepository.save(morningEmbed);

    const previewEmbed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor("#FF0000");

    if (imageUrl) {
      previewEmbed.setImage(imageUrl);
    }

    interaction.reply({
      content: `Het ochtendbericht is opgeslagen en staat ${
        enabled ? "aan" : "uit"
      }. Het wordt elke ochtend willekeurig tussen 7u en 9u verzonden in ${channel}.`,
      embeds: [previewEmbed],
      ephemeral: true,
    });
  },
};
