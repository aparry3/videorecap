import { Generated, Insertable, Selectable, Updateable } from "kysely"
import { Status } from "./Status"

export type CardRecipientTable = {    
    linkId: Generated<string>
    cardId: string
    recipientId: number
    orderId?: number
    batchId?: number
    status?: Status
    statusDetail?: string
}

export type CardRecipient = Selectable<CardRecipientTable>
export type NewCardRecipient = Insertable<CardRecipientTable>
export type CardRecipientUpdate = Updateable<CardRecipientTable>
