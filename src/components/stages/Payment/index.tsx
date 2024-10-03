import { FC, useEffect } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { Stripe} from "@stripe/stripe-js"
import { Card } from "@/lib/@types/Card"
import { PaymentIntent, stripeAppearance } from "@/app/helpers/payments"
import PaymentComponent from "./PaymentComponent"
import { Promo } from "@/lib/@types/Promo"
import { NewRecipient } from "@/lib/@types/Recipient"


interface PaymentProps {
    card: Card
    stripePromise: Promise<Stripe | null>
    subtotal: number
    total: number
    promo?: Promo
    recipients?: NewRecipient[]
    quantity: number
    paymentIntent: PaymentIntent
    updatePromo: (promo?: Promo) => void
}


const Payment: FC<PaymentProps> = ({
        stripePromise,
        card,
        subtotal,
        total,
        promo,
        recipients,
        quantity,
        paymentIntent,
        ...props
    }) => {

    return (
        <Elements stripe={stripePromise} options={{appearance: stripeAppearance, clientSecret: paymentIntent.clientSecret}}>
            <PaymentComponent promo={promo} quantity={quantity} paymentIntent={paymentIntent} total={total} subtotal={subtotal} id={card.id} email={card.email} {...props}/>
        </Elements>
    )
}

export default Payment