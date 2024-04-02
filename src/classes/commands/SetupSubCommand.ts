import { eq } from 'drizzle-orm';

import db from '@/db';
import { type SettingKeys, settingsSchema } from '@/db/schema';

import SubCommand from '../SubCommand';

export default class SetupSubCommand extends SubCommand {
  async UpdateDatabaseKeySetting(key: SettingKeys, value: string | null) {
    if (!value) {
      await db.delete(settingsSchema).where(eq(settingsSchema.key, key));
      await this.client.UpdateSettings();
      return;
    }

    const response = await db.select().from(settingsSchema).where(eq(settingsSchema.key, key));
    await (response.length === 0
      ? db.insert(settingsSchema).values({ key, value })
      : db.update(settingsSchema).set({ value }).where(eq(settingsSchema.key, key)));
    await this.client.UpdateSettings();
  }
}
