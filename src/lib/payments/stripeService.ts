import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    typescript: true,
    apiVersion: '2023-10-16'
})

export const createPaymentIntent = async (quantity: number = 1, price: number = 799) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: price * quantity,
        currency: 'USD'
    })
    return paymentIntent
}

export const updatePaymentIntent = async (id: string, price: number = 799) => {

    const paymentIntent = await stripe.paymentIntents.update(id, {
        amount: price,
        currency: 'USD'
    })
    return paymentIntent
}