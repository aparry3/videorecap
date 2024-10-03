import { Generated, Insertable, Selectable, Updateable } from "kysely"

export type CampaignTable = {    
    id: Generated<string>
    cardId: string
    price: number
    description: string
    title: string
    name: string
    email: string
    subtitle?: string
    imageUrl?: string
    videoUrl?: string
    twitter?: string
    youtube?: string
    tiktok?: string
    instagram?: string
    profileImageUrl?: string
    endDate: Date
    followup?: string
    emailLink?: string
}

export type Campaign = Selectable<CampaignTable>
export type NewCampaign = Insertable<CampaignTable>
export type CampaignUpdate = Updateable<CampaignTable>
