import { Generated, Insertable, Selectable, Updateable } from "kysely"
import { Status } from "./Status"

export type BirthdayCardTable = {    
    id: Generated<string>
    accountId: number
    recipientId: number
    cardId: string
    year: number
    sent?: Date
}

export type BirthdayCard = Selectable<BirthdayCardTable>
export type NewBirthdayCard = Insertable<BirthdayCardTable>
export type BirthdayCardUpdate = Updateable<BirthdayCardTable>
