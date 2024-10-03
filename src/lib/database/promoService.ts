import { sql } from "kysely";
import { NewPromo, Promo } from "../@types/Promo";
import { db } from "./db";


export const insertPromo = async (newPromo: NewPromo): Promise<Promo> => {
    const promo = await db.insertInto('promo').values(
        newPromo
    ).returningAll().executeTakeFirst();

    return promo as Promo
}

export const fetchPromo = async (id: string): Promise<Promo> => {
    const promo = await db.selectFrom('promo').selectAll().where('id', '=', id).executeTakeFirst();
    return promo as Promo
}

export const fetchPromos = async (): Promise<Promo[]> => {
    const promos = await db.selectFrom('promo').selectAll().execute();
    return promos as Promo[]
}



export const incrementPromoUses = async (id: string): Promise<Promo> => {
    console.log(`INCREMENT ${id}`)
    const promo = await db.updateTable('promo')
    .set({used: sql`used + 1`}).where('id', '=', id)
    .returningAll().executeTakeFirst();
    return promo as Promo
}