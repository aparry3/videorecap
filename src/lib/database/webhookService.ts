import { NewWebhook, Webhook } from "../@types/Webhook";
import { db } from "./db";

export const insertWebhookEvent = async (webhook: NewWebhook): Promise<Webhook> => {
    const newWebhook = await db.insertInto('webhook').values(
        webhook
    ).returningAll().executeTakeFirst();

    return newWebhook as Webhook
}
