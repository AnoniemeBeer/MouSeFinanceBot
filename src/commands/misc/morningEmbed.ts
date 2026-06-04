import {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionsBitField,
} from "discord.js";
import {
  ensureMorningMessageSchedule,
  getBrusselsDateKey,
  getMorningMessageSettings,
  sendMorningMessageToChannel,
} from "../../utils/morningMessage";

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
      channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
      required: true,
    },
  ],

  callback: async (client: any, interaction: any) => {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "Dit commando kan alleen in een server gebruikt worden.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel("kanaal");
    const settings = await getMorningMessageSettings();

    settings.guildId = interaction.guildId;
    settings.channelId = channel.id;
    settings.lastSentDate = getBrusselsDateKey(new Date());
    settings.scheduledFor = null;
    await settings.save();

    await sendMorningMessageToChannel(channel);
    await ensureMorningMessageSchedule(client);

    await interaction.editReply({
      content: `Het ochtendbericht is verzonden in ${channel}. Toekomstige ochtendberichten worden automatisch ingepland tussen 07:00 en 09:00 Brusselse tijd.`,
    });
  },
};
