import { AspectRatio, Card, CardUpdate, ENVELOPE_TYPES, MailMethod } from "./@types/Card";
import { Order } from "./@types/Order";
import { Recipient } from "./@types/Recipient";
import { EmailStatus, Status } from "./@types/Status";
import { addEnvelopeOrderToGoogleSheet } from "./google/googleSheetsService";
import { cancelOrder, createOrder } from "./postcards/postcardService";
import { CardRecipientUpdate } from "./@types/CardRecipient";
import { updateCardRecipientLinkByCard } from "./database/cardRecipientService";
import { fetchCard, fetchCardsToSubmit, insertCard, updateCard } from "./database/cardService";
import { fetchRecipient, fetchRecipients } from "./database/recipientService";
import { generateUrlSafeId } from "@/app/api/utils";
import { fetchPromo } from "./database/promoService";
import { Promo } from "./@types/Promo";
import { insertTracking } from "./database/trackingService";

export const finalizeCard = async (card: Card, recipients?: Recipient[], returnRecipient?: Recipient, emailStatus?: EmailStatus): Promise<CardUpdate> => {
    let cardRecipientUpdate: CardRecipientUpdate = {}
    let status: Status = Status.ORDER_SUBMITTED
    let statusDetail: string | undefined        
    let order: Order | undefined
    console.log("RECIPIENTS_LENGTH: ", recipients?.length)

    if (card.mailMethod === MailMethod.NO_ENVELOPE && recipients && recipients.length && returnRecipient) {
        try {
            console.log("ORDER DETAILS")
            console.log(card.id, card.imageUrl, card.backImageUrl, recipients, returnRecipient)
            order = await createOrder(card.id, card.imageUrl!!, card.backImageUrl!!, recipients, returnRecipient)
        } catch (e: any) {
            console.error(`CREATE ORDER ERROR: ${card.id}, MESSAGE: ${e.message}`)
            status = Status.PAID_COMPLETE
            statusDetail = e.message
        }    
    } else if (ENVELOPE_TYPES.includes(card.mailMethod) && card.quantity) {
        console.log(`ADD ENVELOPE ORDER: ${card.id}`)
        await addEnvelopeOrderToGoogleSheet(card, card.quantity)
    } else {
        status = Status.DELIVERED
    }

    cardRecipientUpdate = {
        orderId: order?.orderID,
        batchId: order?.batchID,
        status,
        statusDetail
    } as CardRecipientUpdate
    
    await updateCardRecipientLinkByCard(card.id, cardRecipientUpdate)
    
    return {
        ...cardRecipientUpdate,
        confirmation: emailStatus
    }
}

export const cancelCard = async (id: string): Promise<boolean> => {
    console.log(`CANCEL ORDER: ${id}`)

    const card = await fetchCard(id)
    if (!card) {
        return false
    }
    let success = false
    if (card.mailMethod === MailMethod.NO_ENVELOPE && card.orderId) {
        try {
            success = await cancelOrder(card.orderId)
        } catch (e: any) {
            console.error(`CANCEL ORDER ERROR: ${card.id}, MESSAGE: ${e.message}`)
        }    
    } else {
        return true
    }

    if (success) {
        const cardRecipientUpdate = {
            status: Status.CANCELED
        } as CardRecipientUpdate
        await updateCard(id, cardRecipientUpdate)

        await updateCardRecipientLinkByCard(id, cardRecipientUpdate)
        return true
    }
    return false
    
}


export const resubmitCards = async (): Promise<Card[]> => {
    const cards = await fetchCardsToSubmit()

    const cardPromises = cards.map(async card => {
        const recipients = await fetchRecipients(card.id)
        const returnRecipient = await fetchRecipient(card.returnRecipientId!)
    
        const updateBody = await finalizeCard(card, recipients, returnRecipient, EmailStatus.ORDER_PROCESSING)
    
        return await updateCard(card.id, {
            ...updateBody
        })
    })
    
    const updatedCards = await Promise.all(cardPromises)
    return updatedCards as Card[]
}

const getImageSize = (mailMethod: MailMethod): AspectRatio => {
    return mailMethod === MailMethod.NO_ENVELOPE ? '425x6' : '4x6'
}

export const createCard = async (promo?: string, ipAddress?: string): Promise<Card> => {
    console.log(`CREATING NEW CARD`)
    const id = generateUrlSafeId()
    let validatedPromo: Promo | undefined
    if (promo) {
        validatedPromo = await fetchPromo(promo)
    }
    const card = await insertCard({
        id,
        size: getImageSize(MailMethod.NO_ENVELOPE),
        mailMethod: MailMethod.NO_ENVELOPE,
        status: Status.IN_PROGRESS,
        promo: validatedPromo?.id
    })

    if (!!ipAddress) {
        console.log("INSERT TRACKING ENTRY")
        await insertTracking({
            cardId: id,
            ipAddress
        })
    }
    console.log(`CREATED NEW CARD: ${card.id}`)

    return card;
}