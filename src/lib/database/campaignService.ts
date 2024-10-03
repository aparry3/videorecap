import { sql } from "kysely";
import { Campaign, CampaignUpdate, NewCampaign } from "../@types/Campaign";
import { db } from "./db";


export const insertCampaign = async (newCampaign: NewCampaign): Promise<Campaign> => {
    let id
    if (newCampaign.id) {
        id = newCampaign.id.toLowerCase()
    }
    const campaign = await db.insertInto('campaign').values(
        {...newCampaign, id}
    ).returningAll().executeTakeFirst();

    return campaign as Campaign
}

export const fetchCampaign = async (id: string): Promise<Campaign> => {
    const campaign = await db.selectFrom('campaign').selectAll().where('id', '=', id.toLowerCase()).executeTakeFirst();
    return campaign as Campaign
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
    const campaigns = await db.selectFrom('campaign').selectAll().execute();
    return campaigns as Campaign[]
}

export const updateCampaign = async (id: string, campaign: CampaignUpdate): Promise<Campaign> => {
    const updatedCampaign = await db.updateTable('campaign').set(
        campaign
    ).where("id", "=", id.toLowerCase()).returningAll().executeTakeFirst();

    return updatedCampaign as Campaign
}