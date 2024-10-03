import { Generated, Insertable, Selectable, Updateable } from 'kysely';
import { NewRecipient, RecipientUpdate } from './Recipient';


export enum AccountType { FREE = 'FREE', PAID = 'PAID' }

export interface AccountTable {
    id: Generated<number>
    email: string
    authId: string

    emailNotifications?: boolean
    phoneNotifications?: boolean

    recipientId: number
    accountType?: string
}

export type Account = Selectable<AccountTable>
export type NewAccount = Insertable<AccountTable>
export type AccountUpdate = Updateable<AccountTable>

export type User = Account & NewRecipient
export type UserUpdate = AccountUpdate & RecipientUpdate