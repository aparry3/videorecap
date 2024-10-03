import { Recipient, RecipientUpdate } from "../@types/Recipient";
import { db } from "./db";
import { decryptRecipient } from "./security/recipient";
import { decrypt } from "./security/security";

export const addToRoladex = async (userId: number, recipientIds: number[]): Promise<Recipient[] | undefined> => {
    console.log(`ADDING ROLADEX ADDRESS`)

    await db.insertInto('roladex').values(
        recipientIds.map(recipientId => ({userId, recipientId}))
    ).returningAll().executeTakeFirst();

    const recipients = await db
    .selectFrom('recipient')
    .where('id', 'in', recipientIds)
    .selectAll('recipient')
    .execute();

    return recipients.map(r => decryptRecipient(r)) as Recipient[]
}

// export const updateRecipient = async (id: number, update: RecipientUpdate): Promise<Recipient | undefined> => {
//     console.log(`UPDATE ROLADEX ADDRESS: ${id}`)

//     const newRecipient = await db.updateTable('recipient').set(
//         update
//     ).where('id', '=', id).returningAll().executeTakeFirst();

//     console.log(`UPDATED ROLADEX: ${id}`)

//     return newRecipient
// }


export const fetchAddressesForUser = async (id: number): Promise<Recipient[]> => {
    console.log(`FETCH ROLADEX: user_id: ${id}`)

    const recipients = await db
    .selectFrom('recipient')
    .innerJoin('roladex', 'recipient.id', 'roladex.recipientId')
    .where('roladex.userId', '=', id)
    .selectAll('recipient')
    .execute();

    return recipients.map(r => decryptRecipient(r)) as Recipient[]
}    