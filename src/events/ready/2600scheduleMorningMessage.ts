import { ensureMorningMessageSchedule } from "../../utils/morningMessage";

export default async (client: any) => {
  await ensureMorningMessageSchedule(client);
};
