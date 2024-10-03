import { Generated, Insertable, Selectable, Updateable } from "kysely"
import { EmailStatus, Status } from "./Status"


export type AspectRatio = '4x6' | '425x6' | '5x7'

export enum MailMethod {
    NO_ENVELOPE = 0,
    ENVELOPE = 1,
    SET = 2,
    AT_HOME = 3
}

export const RECIPIENT_TYPES = [MailMethod.ENVELOPE, MailMethod.NO_ENVELOPE]
export const ENVELOPE_TYPES = [MailMethod.ENVELOPE, MailMethod.SET]

export const MAIL_METHOD_MAP = {
    [MailMethod.NO_ENVELOPE]: 'Postcard',
    [MailMethod.ENVELOPE]: 'Greeting Card',
    [MailMethod.AT_HOME]: 'Print Yourself',
    [MailMethod.SET]: 'Box Set',
}


export type CardTable = Partial<{
    message: string | null
    imageUrl: string
    backImageUrl: string
    videoUrl: string
    qrCodeUrl: string
    recipientId: number
    returnRecipientId: number
    modified: Generated<Date>
    proofFront: string
    proofBack: string
    status: Status
    statusDetail: string
    orderId: number
    batchId: number
    confirmation: EmailStatus
    size: AspectRatio
    envelope: boolean
    total: number | null
    promo: string
    quantity: number
    sender: string
    email: string
    question: string
    answer: string
    temporaryImageUrl: string
}> & {    
    id: string
    mailMethod: MailMethod
}

// export interface CardOrder {
//     id: string
//     email: string
//     mailMethod: MailMethod
//     modified: Date
//     status: Status
//     quantity: number
// }


export type Card = Selectable<CardTable>
export type NewCard = Insertable<CardTable>
export type CardUpdate = Updateable<CardTable>
