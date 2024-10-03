import { Insertable, Selectable, Updateable } from "kysely"


export interface PromoTable {
    id: string
    uses: number
    used: number
    amount: number
    minOrderQuantity?: number
}

export type Promo = Selectable<PromoTable>
export type NewPromo = Insertable<PromoTable>
export type PromoUpdate = Updateable<PromoTable>
