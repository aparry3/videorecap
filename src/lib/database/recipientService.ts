import { CardRecipient, CardRecipientUpdate } from "../@types/CardRecipient";
import { EncryptedRecipient, NewRecipient, Recipient, RecipientUpdate } from "../@types/Recipient";
import { db } from "./db";
import { decryptRecipient, encryptNewRecipient, encryptRecipientUpdate } from "./security/recipient";

export const insertRecipients = async (recipients: NewRecipient[]): Promise<Recipient[]> => {
    console.log(`CREATE RECIPIENT`)

    const newRecipients = await db.insertInto('recipient').values(
        recipients.map(r => encryptNewRecipient(r))
    ).returningAll().execute();

    return newRecipients.map(r => decryptRecipient(r)) as Recipient[]
}

export const updateRecipient = async (id: number, update: RecipientUpdate): Promise<Recipient | undefined> => {
    console.log(`UPDATE RECIPIENT: ${id}`)

    const newRecipient = await db.updateTable('recipient').set(
        encryptRecipientUpdate(update)
    ).where('id', '=', id).returningAll().executeTakeFirst();

    console.log(`UPDATED RECIPIENT: ${id}`)

    return newRecipient ? decryptRecipient(newRecipient) : undefined

}

export const fetchRecipient = async (id: number): Promise<Recipient | undefined> => {
    console.log(`FETCH RECIPIENT: recipient_id: ${id}`)

    const recipient = await db.selectFrom('recipient').selectAll().where('id', '=', id).executeTakeFirst();

    return recipient ? decryptRecipient(recipient) : undefined
}

export const fetchRecipients = async (id: string): Promise<Recipient[] | undefined> => {
    console.log(`FETCH RECIPIENTS: card_id: ${id}`)

    const recipients = await db.selectFrom('recipient')
    .leftJoin('cardRecipientLink', 'recipient.id', 'cardRecipientLink.recipientId')
    .selectAll('recipient')
    .where('cardRecipientLink.cardId', '=', id).execute();

    return recipients.map((r: EncryptedRecipient) => decryptRecipient(r)) as Recipient[] || undefined
}
    