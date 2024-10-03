import { Generated, Insertable, Selectable, Updateable } from "kysely"

export type RoladexTable = {    
    id: Generated<string>
    userId: number
    recipientId: number
}

export type Roladex = Selectable<RoladexTable>
export type NewRoladex = Insertable<RoladexTable>
export type RoladexUpdate = Updateable<RoladexTable>
