import Column from "@/components/utils/Container/Column"
import { FC, FormEvent, use, useCallback, useEffect, useState } from "react"
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { StripeLinkAuthenticationElementChangeEvent, StripePaymentElementOptions } from "@stripe/stripe-js"
import Button from "@/components/utils/Button"
import Container from "@/components/utils/Container/Container"
import Form from "@/components/utils/Container/Form"
import Loading from "@/components/loading"
import Text from '@/components/utils/Text'
import styles from './Payment.module.scss'
import Input from "@/components/inputs/Input"
import { fetchPromo } from "@/app/helpers/cards"
import { Promo } from "@/lib/@types/Promo"
import { debounce } from "@/app/helpers/utils"
import { PaymentIntent } from "@/app/helpers/payments"


interface PaymentProps {
    email?: string
    id: string,
    paymentIntent: PaymentIntent,
    total: number
    subtotal: number
    promo?: Promo
    quantity: number
    updatePromo: (promo?: Promo) => void
}


const PaymentComponent: FC<PaymentProps> = ({
        email: 
        propsEmail, 
        id,
        paymentIntent,
        total,
        subtotal,
        promo,
        quantity,
        updatePromo
    }) => {
    const elements = useElements()
    const stripe = useStripe()
    const [loading, setLoading] = useState<boolean>(false)
    const [isFree, setIsFree] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>()
    const [email, setEmail] = useState<string>(propsEmail || '')
    const [promoText, setPromoText] = useState<string | undefined>(promo?.id ?? '')
    
    useEffect(() => {
        console.log("PaymentIntent: ", paymentIntent.id)
        console.log("PaymentIntent: ", paymentIntent.price)
    }, [elements])
    useEffect(() => {
        setEmail(propsEmail || '')
    }, [propsEmail])

    const checkPromo = useCallback(debounce(async () => {
        if (promoText) {
            const validPromo = await fetchPromo(promoText)
            if (validPromo) {
                // location.assign(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/callback/${id}?total=0`)
                updatePromo(validPromo)
            } else {
                updatePromo(undefined)
            }
        }
    }, 500), [promoText])

    useEffect(() => {
        if (promo && promo.amount === 100) {
            setIsFree(true)
        } else {
            setIsFree(false)
        }
    }, [promo])

    useEffect(() => {
        checkPromo()
    }, [promoText])


    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setLoading(true)

        const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/build/${id}/submit?total=${isFree ? 0 : total}${promo ? `&promo=${promo.id}` : ''}`

        if (isFree) {
            window.location.href = returnUrl
            return
        }

        if (!stripe || !elements) {
          // Stripe.js hasn't yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.

            setError('Stripe or Elements not loaded.')
            setLoading(false)
            return;
        }
    
        const result = await stripe.confirmPayment({
          //`Elements` instance that was used to create the Payment Element
          elements,
          confirmParams: {
            return_url: returnUrl
          },
        });
    
        if (result.error && !promo) {
          // Show error to your customer (for example, payment details incomplete)
          setError(result.error.message)
          setLoading(false)
        }
    }, [elements, stripe, promo, isFree, total, id])

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: 'accordion',
    }

    return (
        <>
        {loading && <Loading />}
        <Form onSubmit={handleSubmit} style={{width: '100%'}} className={styles.paymentForm}>
            <Column style={{height: '100%'}}>
            <Container justify="space-between" padding style={{width: '100%'}}>
                <Container>
                    <Text weight={400}>Quantity:</Text>
                    </Container>
                    <Container>
                    <Text weight={600}>{quantity}</Text>
                    </Container>
                </Container>
           
                <Container justify='space-between' padding style={{width: '100%'}}>
                    <Container><Text weight={600}>Subtotal:</Text></Container>
                    <Container><Text weight={600}>${Number((total)/100).toFixed(2) }</Text>{total !== subtotal && (<Container padding={[0, 0.5]}><Text className={styles.strike}>(${Number(subtotal/100).toFixed(2)})</Text></Container>)}</Container>
                </Container>
                {error && (
                <Container padding className={styles.error}>
                    <Text weight={600}>{error}</Text>
                </Container>
                )}
                <Container className={styles.promo}>
                    <input className={styles.promoInput} id="promoInput" onChange={(e) => setPromoText(e.target.value)} value={promoText} placeholder=" "/>
                    <label className={styles.promoLabel} htmlFor="promoInput">Promo</label>
                </Container>
                { !isFree && (
                <>
                    <Container padding={[1, 0]}>
                        <LinkAuthenticationElement
                            options={{defaultValues: {email}}} 
                            onChange={(e: StripeLinkAuthenticationElementChangeEvent) => setEmail(e.value.email)} />
                    </Container>
                    <Container>
                        <PaymentElement options={paymentElementOptions}/>
                    </Container>
                </>
                )}
                <Container padding={[1,0]} style={{width: '100%'}}>
                    <Button inverted disabled={total !== paymentIntent.price && !isFree} onClick={handleSubmit}>
                        submit
                    </Button>
                </Container>
            </Column>
        </Form>
        </>
    )
}

export default PaymentComponent