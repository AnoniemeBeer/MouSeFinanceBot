import { Client } from "discord.js";
import { startMorningEmbedScheduler } from "../../services/morningEmbedScheduler";

export default (client: Client & { morningEmbedSchedulerStarted?: boolean }) => {
  if (client.morningEmbedSchedulerStarted) {
    return;
  }

  client.morningEmbedSchedulerStarted = true;
  startMorningEmbedScheduler(client);
};
