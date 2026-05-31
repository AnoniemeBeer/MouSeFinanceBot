import { Client, EmbedBuilder, TextBasedChannel } from "discord.js";
import { AppDataSource } from "../data-source";
import { MorningEmbed } from "../entity";

const MORNING_START_HOUR = 7;
const MORNING_END_HOUR = 9;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const DATABASE_WAIT_DELAY_MS = 1000;
const MAX_TIMEOUT_MS = 2 ** 31 - 1;
const DEFAULT_TIME_ZONE = "Europe/Brussels";

const getTimeZone = () => process.env.MORNING_EMBED_TIME_ZONE || DEFAULT_TIME_ZONE;

const getTimeZoneParts = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date).reduce((values, part) => {
    if (part.type !== "literal") {
      values[part.type] = Number(part.value);
    }
    return values;
  }, {} as Record<string, number>);

  if (parts.hour === 24) {
    parts.hour = 0;
  }

  return parts;
};

const getTimeZoneOffset = (date: Date, timeZone: string) => {
  const parts = getTimeZoneParts(date, timeZone);
  const utcDate = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return utcDate - date.getTime();
};

const getDateInTimeZone = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string
) => {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const offset = getTimeZoneOffset(utcGuess, timeZone);
  const date = new Date(utcGuess.getTime() - offset);
  const correctedOffset = getTimeZoneOffset(date, timeZone);

  if (correctedOffset !== offset) {
    return new Date(utcGuess.getTime() - correctedOffset);
  }

  return date;
};

const getLocalDateKey = (date: Date, timeZone: string) => {
  const parts = getTimeZoneParts(date, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(
    parts.day
  ).padStart(2, "0")}`;
};

const getRandomMorningDate = (baseDate: Date, timeZone: string) => {
  const parts = getTimeZoneParts(baseDate, timeZone);
  const randomMinutes = Math.floor(
    Math.random() * ((MORNING_END_HOUR - MORNING_START_HOUR) * 60 + 1)
  );
  const hour = MORNING_START_HOUR + Math.floor(randomMinutes / 60);
  const minute = randomMinutes % 60;

  return getDateInTimeZone(
    parts.year,
    parts.month,
    parts.day,
    hour,
    minute,
    0,
    timeZone
  );
};

const getTomorrow = (date: Date) => new Date(date.getTime() + ONE_DAY_IN_MS);

const getNextRunDate = (timeZone: string) => {
  const now = new Date();
  let nextRun = getRandomMorningDate(now, timeZone);

  if (nextRun <= now) {
    nextRun = getRandomMorningDate(getTomorrow(now), timeZone);
  }

  return nextRun;
};

const waitForDatabase = async () => {
  while (!AppDataSource.isInitialized) {
    await new Promise((resolve) => setTimeout(resolve, DATABASE_WAIT_DELAY_MS));
  }
};

const sendMorningEmbeds = async (client: Client, timeZone: string) => {
  await waitForDatabase();

  const today = getLocalDateKey(new Date(), timeZone);
  const morningEmbedRepository = AppDataSource.getRepository(MorningEmbed);
  const morningEmbeds = await morningEmbedRepository.find({
    where: { enabled: true },
  });

  for (const morningEmbed of morningEmbeds) {
    if (morningEmbed.lastSentDate === today) {
      continue;
    }

    try {
      const channel = await client.channels.fetch(morningEmbed.channelId);

      if (!channel || !("send" in channel)) {
        console.log(
          `Morning embed channel ${morningEmbed.channelId} could not be found or is not sendable.`
        );
        continue;
      }

      const embed = new EmbedBuilder()
        .setTitle(morningEmbed.title)
        .setDescription(morningEmbed.description)
        .setColor("#FF0000");

      if (morningEmbed.imageUrl) {
        embed.setImage(morningEmbed.imageUrl);
      }

      await (channel as TextBasedChannel).send({ embeds: [embed] });
      morningEmbed.lastSentDate = today;
      await morningEmbedRepository.save(morningEmbed);
    } catch (error) {
      console.log(
        `There was an error sending morning embed ${morningEmbed.id}: ${error}`
      );
    }
  }
};

const scheduleTimeout = (callback: () => void, delay: number) => {
  if (delay > MAX_TIMEOUT_MS) {
    setTimeout(() => scheduleTimeout(callback, delay - MAX_TIMEOUT_MS), MAX_TIMEOUT_MS);
    return;
  }

  setTimeout(callback, delay);
};

export const startMorningEmbedScheduler = (client: Client) => {
  const timeZone = getTimeZone();

  const scheduleNextRun = () => {
    const nextRun = getNextRunDate(timeZone);
    const delay = nextRun.getTime() - Date.now();
    console.log(
      `Morning embed scheduler will run at ${nextRun.toISOString()} (${timeZone}).`
    );

    scheduleTimeout(async () => {
      await sendMorningEmbeds(client, timeZone);
      scheduleNextRun();
    }, delay);
  };

  scheduleNextRun();
};
