"use client";
import Container from '@/components/utils/Container/Container';
import Text from '@/components/utils/Text'
import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import { StripeAddressElementChangeEvent, StripeExpressCheckoutElementClickEvent, StripeExpressCheckoutElementConfirmEvent, StripeLinkAuthenticationElementChangeEvent, StripePaymentElementOptions, loadStripe } from '@stripe/stripe-js';
import styles from './PaymentForm.module.scss';
import Loading from '@/components/loading';
import Button from '@/components/utils/Button';
import Column from '@/components/utils/Container/Column';
import { PaymentIntent } from '@/app/helpers/payments';
import Form from '@/components/utils/Container/Form';
import { AddressElement, ExpressCheckoutElement, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Promo } from '@/lib/@types/Promo';
import Dash from '@/components/utils/Dash';
import { StripeRecipientDetails } from '@/lib/@types/Recipient';
import Checkbox from '../Checkbox';
import { Link } from '@/components/utils/Link';

export interface PaymentFormProps {
    onPromoUpdate?: (value?: string) => Promise<void>
    showPromo?: boolean
    email?: string
    subtotal: number
    total: number
    promo?: Promo
    paymentIntent: PaymentIntent
    redirectUrl: string
    canSubmit: boolean
    onRecipientChange: (e: StripeRecipientDetails) => string 
    onEmailChange: (e: string) => void
    canEmail?: boolean
    onChangeCanEmail?: (e: boolean) => void
    canEmailText?: string
    isValidUsAddress?: boolean
    emailLink?: string
}

const EMAIL_LINK = process.env.NEXT_PUBLIC_EMAIL_LINK || 'https://betterlettercards.com/creators'

const PaymentForm: FC<PaymentFormProps> = ({emailLink = EMAIL_LINK, isValidUsAddress = true, onRecipientChange, onEmailChange, email, canEmail, canEmailText, canSubmit, onChangeCanEmail, showPromo = true, subtotal, total, promo, onPromoUpdate, redirectUrl}) => {
    const elements = useElements()
    const stripe = useStripe()
    const [error, setError] = useState<string | undefined>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [promoText, setPromoText] = useState<string | undefined>(promo?.id ?? '')

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: 'tabs',
    }

    useEffect(() => {
        onPromoUpdate && onPromoUpdate(promoText)
    }, [promoText])

    useEffect(() => {
        if (promo) {
            setPromoText(promo.id)
        }
    }, [promo])

    const handleEmailChange = (e: StripeLinkAuthenticationElementChangeEvent) => {
        onEmailChange(e.value.email)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        if ('preventDefault' in e) {
            e.preventDefault();
        }
        _handleSubmit()
    }
    const _handleSubmit = useCallback(async (returnUrl?: string) => {
        setLoading(true);

        if (total === 0) {
            window.location.href = redirectUrl;
            return;
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
            return_url: returnUrl ?? redirectUrl
          },
        });
    
        if (result.error && !promo) {
          // Show error to your customer (for example, payment details incomplete)
          setError(result.error.message)
          setLoading(false)
        }
    }, [elements, stripe, promo, total, total, redirectUrl])

    const handleSubmitExpress = useCallback(async (e: StripeExpressCheckoutElementConfirmEvent) => {
        const address = e.shippingAddress
        const billing = e.billingDetails
        console.log(address, billing)
        if (! address || !billing) {
            return
        }
        const returnUrl = onRecipientChange({...address, email: billing.email})
        _handleSubmit(returnUrl)
    }, [onRecipientChange, _handleSubmit])

    const handleAddressChange = useCallback(async (e: StripeAddressElementChangeEvent) => {
        onRecipientChange({...e.value, email})
    }, [onRecipientChange])

    const onClickCheckout = ({resolve}: StripeExpressCheckoutElementClickEvent) => {
        const options = {
          emailRequired: true,
          shippingAddressRequired: true,
        //   shippingRates: [
        //     {
        //         id: 'standard',
        //         amount: 89,
        //         displayName: 'Standard'
        //     }
        //   ]
        };
        resolve(options);
      };
      
    return (
        <>
        {loading && <Loading />}
        <Form onSubmit={handleSubmit} style={{width: '100%'}} className={styles.paymentForm} padding={2}>
            <Column style={{height: '100%', width: '100%', alignItems: 'stretch'}}>
                <Container justify='space-between' padding style={{width: '100%'}}>
                    <Container><Text weight={600}>Subtotal:</Text></Container>
                    <Container><Text weight={600}>${Number((total)/100).toFixed(2) }</Text>{total !== subtotal && (<Container padding={[0, 0.5]}><Text className={styles.strike}>(${Number(subtotal/100).toFixed(2)})</Text></Container>)}</Container>
                </Container>
                {error && (
                <Container padding className={styles.error}>
                    <Text weight={600}>{error}</Text>
                </Container>
                )}
                {showPromo && (
                <Container className={styles.promo}>
                    <input className={styles.promoInput} id="promoInput" onChange={(e) => setPromoText(e.target.value)} value={promoText} placeholder=" "/>
                    <label className={styles.promoLabel} htmlFor="promoInput">Promo</label>
                </Container>

                )}
                { total !== 0 && (
                <>
                    <Container padding={[1, 0]} style={{justifyContent: 'stretch'}}>
                        <ExpressCheckoutElement onConfirm={handleSubmitExpress} onClick={onClickCheckout} />
                    </Container>
                    <Container style={{width:'100%'}}>
                        <Dash />
                        <Text>OR</Text>
                        <Dash />
                    </Container>
                    <Column padding={[1, 0]}>
                        <Container padding={[1,0]} style={{width: '100%'}}>
                            <LinkAuthenticationElement
                                options={{defaultValues: {email: email || ''}}} 
                                onChange={handleEmailChange} />
                        </Container>
                        { onChangeCanEmail && (
                        <Container style={{width: '100%'}} justify='flex-start' className={styles.canEmailContainer}>
                            <Checkbox value={!!canEmail} onChange={onChangeCanEmail} />
                            <Container style={{cursor: 'pointer'}} onClick={() => onChangeCanEmail(!canEmail)}>
                                { canEmailText ? 
                                (<Text size={0.9} weight={300}>{canEmailText}</Text>) : 
                                (<Text size={0.9} weight={300}>Allow email updates and notifications</Text>)}
                            </Container>
                        </Container>
                        )}
                        <Container padding={[1,0]} style={{width: '100%'}} justify='flex-start'>
                            <Text size={1.2} weight={600}>Shipping Details</Text>
                        </Container>
                        <Container style={{width: '100%'}} >
                            <AddressElement onChange={handleAddressChange} options={{mode: 'shipping'}} />
                        </Container>
                    </Column>
                    {isValidUsAddress ? (
                        <>
                            <Container padding={[1,0]} style={{width: '100%'}} justify='flex-start'>
                                <Text size={1.2} weight={600}>Payment Details</Text>
                            </Container>
                            <Container style={{width: '100%'}}>
                                <PaymentElement options={paymentElementOptions}/>
                            </Container>
                        </>
                    
                    ) : (
                        <Column>
                            <Container padding={[0.5, 0]}>
                                <Text size={1.2} weight={600}>Only US addresses are supported at this time</Text>
                            </Container>
                            <Link link={emailLink}><Text className={styles.link}>Follow this link to be notified when we add support for international addresses!</Text></Link>
                        </Column>
                    )}
                </>
                )}
                <Container padding={[1,0]} style={{width: '100%'}}>
                    <Button inverted disabled={!canSubmit} onClick={handleSubmit}>
                        submit
                    </Button>
                </Container>
            </Column>
        </Form>
        </>
    )
};


export default PaymentForm;