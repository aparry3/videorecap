import { Order } from "../@types/Order";
import { Recipient } from "../@types/Recipient";
import axios from 'axios'

const pcmApi = axios.create({
    baseURL: process.env.PCM_BASE_URL,
    timeout: 5000,
})

export const getToken = async (): Promise<string> => {
    const key = process.env.PCM_AUTH_KEY
    const secret = process.env.PCM_AUTH_SECRET

    console.log(`FETCH TOKEN`)

    const {token} = await pcmApi.post(`/auth/login`, {
        apiKey: key,
        apiSecret: secret
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
    }).then(res => res.data)

    return token

}
export const createOrder = async (id: string, image: string, back: string, recipients: Recipient[], returnRecipient: Recipient): Promise<Order> => {
    const token = await getToken()
    console.log(`CREATE ORDER: ${id}`)

    const response = await pcmApi.post(`/order/postcard`, {
        extRefNbr: id,
        mailClass: "FirstClass",
        size: "46",
        front: image,
        back,
        globalDesignVariables: [],
        recipients: recipients.map(recipient => ({
            extRefNbr: String(recipient.id),
            firstName: recipient.name,
            lastName: " ",
            address: recipient.addressLineOne,
            address2: recipient.addressLineTwo || '',
            city: recipient.city,
            state: recipient.state,
            zipCode: recipient.zipcode
        })),
        returnAddress: {
            firstName: returnRecipient.name,
            lastName: " ",
            address: returnRecipient.addressLineOne,
            address2: returnRecipient.addressLineTwo || '',
            city: returnRecipient.city,
            state: returnRecipient.state,
            zipCode: returnRecipient.zipcode
        },
        addons: [
            {
              addon: "UV",
              options: {}
            }
        ]           
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const data = response.data
    return data
}

export const cancelOrder = async (id: number): Promise<boolean> => {
    const token = await getToken()
    console.log(`CANCEL ORDER: ${id}`)

    const response = await pcmApi.delete(`/order/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    return response.status === 204
}