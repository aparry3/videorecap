import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { CardTable } from "../@types/Card";
import { EncryptedRecipientTable, RecipientTable } from "../@types/Recipient";
import { Pool } from "pg";
import { PromoTable } from "../@types/Promo";
import { WebhookTable } from "../@types/Webhook";
import { MediaTrackingTable, TrackingTable } from "../@types/Tracking";
import { CardRecipientTable } from "../@types/CardRecipient";
import { CampaignTable } from "../@types/Campaign";
import { AccountTable } from "../@types/Account";
import { RoladexTable } from "../@types/Roladex";
import { BirthdayCardTable } from "../@types/BirthdayCard";

export interface Database {
    card: CardTable
    cardRecipientLink: CardRecipientTable
    recipient: EncryptedRecipientTable
    promo: PromoTable
    webhook: WebhookTable
    tracking: TrackingTable
    mediaTracking: MediaTrackingTable
    campaign: CampaignTable
    account: AccountTable
    roladex: RoladexTable
    birthdayCard: BirthdayCardTable
}

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    ssl: {}
  }),
})
  
  // Database interface is passed to Kysely's constructor, and from now on, Kysely 
  // knows your database structure.
  // Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
  // to communicate with your database.
  export const db = new Kysely<Database>({
    dialect,
    plugins: [
      new CamelCasePlugin()
    ]
  })
  
  
  