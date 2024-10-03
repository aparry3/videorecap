import { BirthdayCard, BirthdayCardUpdate } from "../@types/BirthdayCard";
import { Card, CardUpdate, MailMethod, NewCard } from "../@types/Card";
import { CardRecipientUpdate } from "../@types/CardRecipient";
import { Status } from "../@types/Status";
import { db } from "./db";

export const insertCard = async (card: NewCard): Promise<Card> => {
    console.log(`CREATE CARD: ${card.id}`)

    const newCard = await db.insertInto('card').values(
        card
    ).returningAll().executeTakeFirst();

    return newCard as Card
}

export const updateCard = async (id: string, card: CardUpdate): Promise<Card | undefined> => {
    if (id) {
        console.log(`UPDATE CARD: ${id}`)

        const newCard = await db.updateTable('card').set(
            card
        ).where('id', '=', id).returningAll().executeTakeFirst();
    
        console.log(`UPDATED CARD: ${id}`)

        return newCard
    }
    return 
}

export const updateBatch = async (batchId: number, update: CardUpdate | CardRecipientUpdate): Promise<boolean> => {
    if (batchId) {
        console.log(`UPDATE BATCH: ${batchId}`)

        const updateCardResults = await db.updateTable('card').set(
            update
        ).where('batchId', '=', batchId).executeTakeFirst();
    
        const updateCardRecipientResults = await db.updateTable('cardRecipientLink').set(
            update
        ).where('batchId', '=', batchId).executeTakeFirst();

        console.log(`UPDATED ${updateCardResults.numUpdatedRows} CARDS. BATCH_ID: ${batchId}`)
        console.log(`UPDATED ${updateCardRecipientResults.numUpdatedRows} CARDS RECIPIENTS. BATCH_ID: ${batchId}`)
        return updateCardResults.numUpdatedRows > 0 && updateCardRecipientResults.numUpdatedRows > 0
    }
    return false
}

export const updateStatus = async (id: string, update: CardUpdate | CardRecipientUpdate): Promise<boolean> => {
    if (id) {
        console.log(`UPDATE CARD: ${id}`)

        const updateCardResults = await db.updateTable('card').set(
            update
        ).where('id', '=', id).executeTakeFirst();
    
        const updateCardRecipientResults = await db.updateTable('cardRecipientLink').set(
            update
        ).where('cardId', '=', id).executeTakeFirst();

        console.log(`UPDATED ${updateCardResults.numUpdatedRows} CARDS. ID: ${id}`)
        console.log(`UPDATED ${updateCardRecipientResults.numUpdatedRows} CARDS RECIPIENTS. CARD_ID: ${id}`)
        return updateCardResults.numUpdatedRows > 0 && updateCardRecipientResults.numUpdatedRows > 0
    }
    return false
}



export const fetchCard = async (id: string): Promise<Card> => {
    const card = await db.selectFrom('card').selectAll().where('id', '=', id).executeTakeFirst();
    return card as Card
}

export const fetchBirthdayCard = async (cardId: string): Promise<BirthdayCard | undefined> => {
    const birthdayCard = await db.selectFrom('birthdayCard').selectAll().where('cardId', '=', cardId).executeTakeFirst();
    return birthdayCard as BirthdayCard
}

export const updateBirthdayCard = async (cardId: string, birthdayCardUpdate: BirthdayCardUpdate): Promise<BirthdayCard | undefined> => {
    const birthdayCard = await db.updateTable('birthdayCard').set({...birthdayCardUpdate}).where('cardId', '=', cardId).returningAll().executeTakeFirst();
    return birthdayCard as BirthdayCard
}



export const fetchCardsByEmail = async (email: string): Promise<Card[]> => {
    const cards = await db.selectFrom('card').selectAll().where('email', '=', email).execute();
    return cards as Card[]
}


export const fetchCardsToSubmit = async (): Promise<Card[]> => {
    const cards = await db
        .selectFrom('card')
        .selectAll()
        .where('status', '=', Status.PAID_COMPLETE)
        .where('mailMethod', '=', MailMethod.NO_ENVELOPE)
        .execute();
    return cards
}



// TODO Rethink this

// async function countCards(): Promise<{ totalCount: number, envelopeCount: number }> {
//     // Query the 'card' table with conditional aggregation
//     const result = await db
//       .selectFrom('card')
//       .select(({fn}) => [
//         fn.count("card.id").as("total"),
//         db.selectFrom('card')
//         .select(({fn}) => [
//             fn.count("card.id").as("total")
//         ])
//         .where('mailMethod', '=', MailMethod.ENVELOPE)
//         .as('envelopes')
//       ])
//       .executeTakeFirst();
  
//     return {
//       totalCount: Number(result?.total ?? 0),
//       envelopeCount: Number(result?.envelopes ?? 0)
//     };
//   }
  