"use client";
import { FC } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentIntent, stripeAppearance } from '@/app/helpers/payments';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm, { PaymentFormProps } from './PaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '')

interface PaymentProps extends PaymentFormProps {
    paymentIntent: PaymentIntent
}

const Payment: FC<PaymentProps> = ({
        // stripePromise,
        paymentIntent,
        ...props
    }) => {

    return (
        <Elements stripe={stripePromise} options={{appearance: stripeAppearance, clientSecret: paymentIntent.clientSecret}}>
            <PaymentForm  paymentIntent={paymentIntent} {...props}/>
        </Elements>
    )
}

export default Payment;
