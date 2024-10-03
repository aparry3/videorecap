import { CardRecipient, CardRecipientUpdate } from "../@types/CardRecipient";
import { Status } from "../@types/Status";
import { db } from "./db";

export const fetchCardRecipientByRecipient = async (recipientId: string): Promise<CardRecipient> => {
    const _recipientId = Number(recipientId)

    const cardRecipient = await db
    .selectFrom('cardRecipientLink')
    .selectAll()
    .where('recipientId', '=', _recipientId)
    .executeTakeFirst();

    return cardRecipient as CardRecipient
}

export const fetchCardRecipientStatuses = async (cardId: string): Promise<(Status | undefined)[]> => {
    const cardStatuses = await db.selectFrom('cardRecipientLink').select(['status']).where('cardId', '=', cardId).execute();
    return cardStatuses.map(cr => cr.status)
}


export const insertCardRecipientLink = async (cardId: string, ids: number[], emailAllowed = false): Promise<CardRecipient[]> => {
    console.log(`INSERT CARD LINKS: recipient_ids: ${ids}`)

    const CardRecipients = await db.insertInto('cardRecipientLink')
        .values(ids.map(id => ({cardId: cardId, recipientId: id, emailAllowed})))
        .returningAll()
        .execute()

    return CardRecipients as CardRecipient[]
}

export const updateCardRecipientLink = async (cardId: string, recipientId: number, cardRecipient: CardRecipientUpdate): Promise<CardRecipient | undefined> => {
    if (cardId) {
        console.log(`UPDATE CARD RECIPIENT: ${cardId}`)

        const newCardRecipient = await db
        .updateTable('cardRecipientLink')
        .set(
            cardRecipient
        )
        .where('cardId', '=', cardId)
        .where('recipientId', '=', recipientId)
        .returningAll()
        .executeTakeFirst();
    
        console.log(`UPDATED CARD RECIPIENT: ${cardId}`)

        return newCardRecipient
    }
    return 
}

export const updateCardRecipientLinkByCard = async (cardId: string, cardRecipient: CardRecipientUpdate): Promise<CardRecipient[] | undefined> => {
    if (cardId) {
        console.log(`UPDATE CARD RECIPIENT: ${cardId}`)

        const newCardRecipients = await db
        .updateTable('cardRecipientLink')
        .set(
            cardRecipient
        )
        .where('cardId', '=', cardId)
        .returningAll()
        .execute();
    
        console.log(`UPDATED CARD RECIPIENTS: ${cardId}`)

        return newCardRecipients
    }
    return 
}

export const deleteCardRecipients = async (cardId: string, recipientIds: number[]): Promise<number> => {
    console.log(`DELETE CARD RECIPIENTS: ${cardId}`)

    const result = await db
    .deleteFrom('cardRecipientLink')
    .where('cardId', '=', cardId)
    .where('recipientId', 'in', recipientIds)
    .executeTakeFirst();

    return Number(result.numDeletedRows) ?? 0
    
}



