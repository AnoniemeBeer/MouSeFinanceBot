import {
  AttachmentBuilder,
  ChannelType,
  Client,
  EmbedBuilder,
  NewsChannel,
  TextChannel,
} from "discord.js";
import { get } from "https";
import path from "path";
import { AppDataSource } from "../data-source";
import { MorningMessageSettings } from "../entity";

type ZenQuote = {
  q: string;
  a: string;
};

type BrusselsDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const SETTINGS_ID = "default";
const ZEN_QUOTES_TODAY_URL = "https://zenquotes.io/api/today";
const MORNING_IMAGE_NAME = "tijgerinnetje.webp";
const BRUSSELS_TIME_ZONE = "Europe/Brussels";
const MORNING_WINDOW_START_HOUR = 7;
const MORNING_WINDOW_END_HOUR = 9;

let morningMessageTimeout: NodeJS.Timeout | null = null;

const brusselsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BRUSSELS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

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

const getBrusselsDateParts = (date: Date): BrusselsDateParts => {
  const parts = brusselsFormatter.formatToParts(date);
  const lookup = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
    second: Number(lookup.second),
  };
};

export const getBrusselsDateKey = (date: Date): string => {
  const { year, month, day } = getBrusselsDateParts(date);

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

const getOffsetForTimeZone = (date: Date, timeZone: string): number => {
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
  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  const utcTimestamp = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour),
    Number(lookup.minute),
    Number(lookup.second)
  );

  return utcTimestamp - date.getTime();
};

const brusselsTimeToUtc = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number
): Date => {
  let utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);

  for (let i = 0; i < 3; i += 1) {
    const offset = getOffsetForTimeZone(
      new Date(utcGuess),
      BRUSSELS_TIME_ZONE
    );
    const adjusted =
      Date.UTC(year, month - 1, day, hour, minute, second) - offset;

    if (adjusted === utcGuess) {
      break;
    }

    utcGuess = adjusted;
  }

  return new Date(utcGuess);
};

const getWindowBoundsForDate = (date: Date) => {
  const { year, month, day } = getBrusselsDateParts(date);

  return {
    start: brusselsTimeToUtc(
      year,
      month,
      day,
      MORNING_WINDOW_START_HOUR,
      0,
      0
    ),
    end: brusselsTimeToUtc(year, month, day, MORNING_WINDOW_END_HOUR, 0, 0),
  };
};

const getRandomScheduleForDate = (date: Date): Date => {
  const { start, end } = getWindowBoundsForDate(date);
  const range = end.getTime() - start.getTime();
  const offset = Math.floor(Math.random() * Math.max(range, 1));

  return new Date(start.getTime() + offset);
};

const getNextDayReference = (date: Date): Date => {
  const { year, month, day } = getBrusselsDateParts(date);

  return brusselsTimeToUtc(year, month, day + 1, 12, 0, 0);
};

const getMorningChannel = async (
  client: Client,
  channelId: string
): Promise<TextChannel | NewsChannel | null> => {
  const channel = await client.channels.fetch(channelId).catch(() => null);

  if (
    !channel ||
    (channel.type !== ChannelType.GuildText &&
      channel.type !== ChannelType.GuildAnnouncement)
  ) {
    return null;
  }

  return channel;
};

const buildMorningEmbed = async (): Promise<{
  embed: EmbedBuilder;
  image: AttachmentBuilder;
}> => {
  const dailyQuote = await fetchDailyQuote();
  const image = new AttachmentBuilder(
    path.join(__dirname, "..", "..", "assets", MORNING_IMAGE_NAME)
  );

  const embed = new EmbedBuilder()
    .setTitle("tijgerinnetje")
    .setDescription("Goeiemorgen")
    .setColor("#53fc0b")
    .setImage(`attachment://${MORNING_IMAGE_NAME}`);

  if (dailyQuote) {
    embed.setFooter({
      text: `${dailyQuote.q} - ${dailyQuote.a}`,
    });
  }

  return { embed, image };
};

export const getMorningMessageSettings =
  async (): Promise<MorningMessageSettings> => {
    const repository = AppDataSource.getRepository(MorningMessageSettings);
    let settings = await repository.findOne({ where: { id: SETTINGS_ID } });

    if (!settings) {
      settings = repository.create({
        id: SETTINGS_ID,
        guildId: null,
        channelId: null,
        lastSentDate: null,
        scheduledFor: null,
      });
      await repository.save(settings);
    }

    return settings;
  };

export const sendMorningMessageToChannel = async (
  channel: TextChannel | NewsChannel
): Promise<void> => {
  const { embed, image } = await buildMorningEmbed();
  await channel.send({ embeds: [embed], files: [image] });
};

const sendScheduledMorningMessage = async (
  client: Client,
  settings: MorningMessageSettings
): Promise<boolean> => {
  if (!settings.channelId) {
    return false;
  }

  const channel = await getMorningChannel(client, settings.channelId);

  if (!channel) {
    return false;
  }

  await sendMorningMessageToChannel(channel);
  settings.lastSentDate = getBrusselsDateKey(new Date());
  settings.scheduledFor = null;
  await settings.save();

  return true;
};

const queueMorningMessage = async (
  client: Client,
  scheduledFor: Date
): Promise<void> => {
  if (morningMessageTimeout) {
    clearTimeout(morningMessageTimeout);
  }

  const delay = Math.max(scheduledFor.getTime() - Date.now(), 0);

  morningMessageTimeout = setTimeout(async () => {
    try {
      const settings = await getMorningMessageSettings();
      const todayKey = getBrusselsDateKey(new Date());

      if (settings.lastSentDate === todayKey) {
        await ensureMorningMessageSchedule(client);
        return;
      }

      await sendScheduledMorningMessage(client, settings);
    } catch (error) {
      console.log("Failed to send scheduled morning message", error);
    } finally {
      await ensureMorningMessageSchedule(client);
    }
  }, delay);
};

export const ensureMorningMessageSchedule = async (
  client: Client
): Promise<void> => {
  const settings = await getMorningMessageSettings();

  if (!settings.channelId) {
    if (morningMessageTimeout) {
      clearTimeout(morningMessageTimeout);
      morningMessageTimeout = null;
    }

    return;
  }

  const now = new Date();
  const todayKey = getBrusselsDateKey(now);
  const { start, end } = getWindowBoundsForDate(now);

  if (settings.lastSentDate === todayKey) {
    const nextSchedule = getRandomScheduleForDate(getNextDayReference(now));
    settings.scheduledFor = nextSchedule.toISOString();
    await settings.save();
    await queueMorningMessage(client, nextSchedule);
    return;
  }

  if (settings.scheduledFor) {
    const scheduledFor = new Date(settings.scheduledFor);

    if (getBrusselsDateKey(scheduledFor) === todayKey) {
      if (scheduledFor.getTime() >= now.getTime()) {
        await queueMorningMessage(client, scheduledFor);
        return;
      }

      if (now.getTime() < end.getTime()) {
        await sendScheduledMorningMessage(client, settings);
        await ensureMorningMessageSchedule(client);
        return;
      }
    }
  }

  if (now.getTime() >= start.getTime() && now.getTime() < end.getTime()) {
    const scheduledFor = getRandomScheduleForDate(now);
    settings.scheduledFor = scheduledFor.toISOString();

    if (scheduledFor.getTime() <= now.getTime()) {
      await settings.save();
      await sendScheduledMorningMessage(client, settings);
      await ensureMorningMessageSchedule(client);
      return;
    }

    await settings.save();
    await queueMorningMessage(client, scheduledFor);
    return;
  }

  const nextReference =
    now.getTime() >= end.getTime() ? getNextDayReference(now) : now;
  const nextSchedule = getRandomScheduleForDate(nextReference);
  settings.scheduledFor = nextSchedule.toISOString();
  await settings.save();
  await queueMorningMessage(client, nextSchedule);
};
