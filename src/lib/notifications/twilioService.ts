import Twilio from 'twilio'


export const sendOrderNotification = async (total?: number, envelope?: number) => {
    console.log("SEND TEXT MESSAGE")
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    if (!accountSid) throw new Error("No TWILIO_ACCOUNT_SID")

    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!authToken) throw new Error("No TWILIO_AUTH_TOKEN")

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromNumber) throw new Error("No TWILIO_PHONE_NUMBER")

    const toNumber = process.env.PHONE_NUMBER
    if (!toNumber) throw new Error("No PHONE_NUMBER")

    const client = Twilio(accountSid, authToken)

    const message = await client.messages.create({
        body: `New Envelope Order`,
        to: toNumber,
        from: fromNumber
    })

    return message
}