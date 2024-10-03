import { Generated, Insertable, Selectable, Updateable } from "kysely"


export type WebhookTable = {    
    id: Generated<number>
    event: string
    data: string
    received: Generated<Date>
}

export type Webhook = Selectable<WebhookTable>
export type NewWebhook = Insertable<WebhookTable>
export type WebhookUpdate = Updateable<WebhookTable>
