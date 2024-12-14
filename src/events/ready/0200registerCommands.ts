import { REST, Routes, ApplicationCommandOptionType } from "discord.js";
import dotenv from "dotenv";
import getLocalCommands from "../../utils/getLocalCommands";
import getApplicationCommands from "../../utils/getApplicationCommands";
import areCommandsDifferent from "../../utils/areCommandsDifferent";

dotenv.config();

export default async (client: any) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      process.env.GUILD_ID
    );

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;
      const existingCommand = await applicationCommands.cache.find(
        (cmd: any) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${name}`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
          console.log(`Updated command ${name}`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `skipping registeren command ${name} as it is set to delete.`
          );
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`Registered command ${name}`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
