import { Account, AccountUpdate, NewAccount, User } from "../@types/Account";
import { db } from "./db";
import { fetchRecipient } from "./recipientService";

export const insertAccount = async (account: NewAccount): Promise<Account> => {
    console.log(`CREATE RECIPIENT`)

    const newAccount = await db.insertInto('account').values(
        [account]
    ).returningAll().executeTakeFirst();

    return newAccount as Account
}

export const updateAccount = async (id: number, update: AccountUpdate): Promise<Account | undefined> => {
    console.log(`UPDATE RECIPIENT: ${id}`)

    const newAccount = await db.updateTable('account').set(
        update
    ).where('id', '=', id).returningAll().executeTakeFirst();


    return newAccount
}

export const fetchAccount = async (id: number): Promise<Account | undefined> => {
    console.log(`FETCH USER: account_id: ${id}`)

    const account = await db.selectFrom('account').selectAll().where('id', '=', id).executeTakeFirst();

    return account as Account || undefined
}

export const fetchAccountByEmail = async (email: string): Promise<Account | undefined> => {
    console.log(`FETCH USER: email: ${email}`)

    const account = await db.selectFrom('account').selectAll().where('email', '=', email).executeTakeFirst();

    return account as Account || undefined
}

export const fetchUser = async (account: Account): Promise<User | undefined> => {
    const user = await fetchRecipient(account.recipientId);

    if (user) {
        return {...account, ...user, id: account.id, email: account.email}
    }
    return undefined
}
    