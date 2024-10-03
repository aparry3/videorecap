import client, {MailDataRequired} from '@sendgrid/mail'
import { Card, MAIL_METHOD_MAP } from '../@types/Card'
import { Campaign } from '../@types/Campaign'


export const sendEmail = async (email: string, template: string, data: any) => {
    if (process.env.NEXT_PUBLIC_TEST) {
        return true
    }

    if (!process.env.SENDGRID_API_KEY) {
        throw new Error("Missing SendGrid API Key")
    }

    client.setApiKey(process.env.SENDGRID_API_KEY || '')

    const fromEmail = process.env.SENDGRID_EMAIL || 'no-reply@betterlettercards.com'
    const msg = {
      to: email,
      from: {email: fromEmail, name: 'Better Letter Card Co.'},
      templateId: template,
      dynamicTemplateData: data
    } as MailDataRequired
    console.log(msg)
    const res = await client.send(msg)
    console.log(res)
    return true

}

const createMessage = (videoPresent: boolean, recipientNames: string[]) => {
    return videoPresent ? `${recipientNames[0]}${recipientNames.length > 1 ? ' and the others' : ''} will appreciate your message!` : `You're almost done. Upload a video to send your card.`
}

export const sendCreatorConfirmation = async (email: string, recipientId: number, campaign: Campaign): Promise<boolean> => {
    const data = {
        confirmation_number: `${recipientId}`,
        name: campaign.name.split(' ')[0],
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://betterlettercards.com'}/creators/${campaign.id}/confirmation?recipient=${recipientId}`,
        image_url: campaign.profileImageUrl,
    }
    console.log(data)
    
    if (!process.env.SENDGRID_CREATOR_CONFIRMATION_TEMPLATE_ID) {
        throw new Error("Missing SendGrid Template ID")
    }
    try {
        console.log(`SEND CREATOR CONFIRMATION: ${campaign.id}`)

        await sendEmail(email, process.env.SENDGRID_CREATOR_CONFIRMATION_TEMPLATE_ID, data)
  
    } catch (e: any) {
        console.error(`SEND CONFIRMATION ERROR: ${campaign.id}, MESSAGE: ${e.message}`)
        return false
    }
    return true
}

export const sendConfirmation = async (email: string, id: string, recipientNames: string[], videoPresent: boolean): Promise<boolean> => {
    const data = {
        confirmation_number: id,
        message: recipientNames.length > 0 ? createMessage(videoPresent, recipientNames) : '',
        video_present: videoPresent
    }

    if (!process.env.SENDGRID_TEMPLATE_ID) {
        throw new Error("Missing SendGrid Template ID")
    }
    try {
        console.log(`SEND CONFIRMATION: ${id}`)

        await sendEmail(email, process.env.SENDGRID_TEMPLATE_ID, data)
  
    } catch (e: any) {
        console.error(`SEND CONFIRMATION ERROR: ${id}, MESSAGE: ${e.message}`)
        return false
    }
    return true
}

export const sendWelcome = async (email: string, id: string): Promise<boolean> => {
    if (!process.env.SENDGRID_WELCOME_TEMPLATE_ID) {
        throw new Error("Missing SendGrid Welcome Template ID")
    }

    try {
        console.log(`SEND WELCOME: ${id}`)

        await sendEmail(email, process.env.SENDGRID_WELCOME_TEMPLATE_ID, { confirmation_number: id})
  
    } catch (e: any) {
        console.error(`SEND WELCOME ERROR: ${id}, MESSAGE: ${e.message}`)
        return false
    }
    return true
}

export const sendDelivered = async (email: string, id: string, recipientNames: string[]): Promise<boolean> => {
    if (!process.env.SENDGRID_DELIVERED_TEMPLATE_ID) {
        throw new Error("Missing SendGrid Delivered Template ID")
    }

    const data = {        
        confirmation_number: id,
        recipeint_name: recipientNames[0],
        total: recipientNames.length,
    }
    try {
        console.log(`SEND DELIVERED: ${id}`)

        await sendEmail(email, process.env.SENDGRID_DELIVERED_TEMPLATE_ID, data)
  
    } catch (e: any) {
        console.error(`SEND DELIVERED ERROR: ${id}, MESSAGE: ${e.message}`)
        return false
    }
    return true
}

export const sendOrderEmailNotification = async (card: Card, total: number, quantity?: number): Promise<boolean> => {
    try {
        console.log(`SEND ORDER NOTIFICATION`)

        client.setApiKey(process.env.SENDGRID_API_KEY || '')

        client.send({
            from: process.env.SENDGRID_EMAIL || 'no-reply@betterlettercards.com',
            to: 'aaron@betterlettercards.com',
            subject: `New ${MAIL_METHOD_MAP[card.mailMethod]} Order - ${card.id}`,
            text: `
            New ${MAIL_METHOD_MAP[card.mailMethod]} Order\n
            Total: $${Number((total ?? 0)/100).toFixed(2)}

            Order: ${card.id}\n
            Email: ${card.email}
            Recipients: ${quantity}\n
            `,          
        })
    } catch (e: any) {
        console.error(`SEND ORDER NOTIFICATION ERROR: ${e.message}`)
        return false
    }
    return true
}


