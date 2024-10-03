"use client";
import Button from "@/components/utils/Button"
import Column from "@/components/utils/Container/Column"
import styles from './Quantity.module.scss'
import { StageProps } from "../BaseStage"
import { FC } from "react"
import { Promo } from "@/lib/@types/Promo";
import Container from "@/components/utils/Container/Container";
import Text from "@/components/utils/Text";
import Dash from "@/components/utils/Dash";
import { calculateTotal, promoApplies } from "@/lib/payments/cardPricing";
import Input from "@/components/inputs/Input";


interface QuantityProps {
    updateQuantity: (quantity: number) => void
    quantity: number
}


const Quantity: FC<QuantityProps> = ({updateQuantity, quantity}) => {
    const incrementQuantity = (increment = true) => {
        updateQuantity(increment ? quantity + 5 : quantity - 5 > 0 ? quantity - 5 : quantity)
    }
    const handleChange = (value?: string) => {
        if (value && !isNaN(+value)) {
            updateQuantity(+value)
        }
    }

    return (
        <Column style={{width: '100%', height: '100%'}}>
            <Container style={{width:'100%', flexGrow: 1}}>
                <Container style={{alignItems: 'stretch'}}>
                    <Container padding={0.5}>
                        <Button onClick={() => incrementQuantity(false)}>
                            <Container padding={1.5}>
                                <Text size={2.5} weight={600}>-</Text>
                            </Container>
                        </Button>
                    </Container>
                    <Container style={{flexGrow: 1}}>
                        <Input style={{height: '100%'}} inputStyle={{fontSize: '4rem', textAlign: 'center'}} onChange={handleChange} value={String(quantity)} />
                    </Container>
                    <Container padding={0.5}>
                        <Button onClick={() => incrementQuantity()}>
                            <Container padding={1.5}>
                                <Text size={2.5} weight={600}>+</Text>
                            </Container>
                        </Button>
                    </Container>
                </Container>
            </Container>
            <Container style={{width:'100%'}}>
                    <Dash />
            </Container>
            <Container justify="space-between" style={{width: '100%'}}>
                <Container>
                    <Text weight={600}>Quantity: {quantity || 0}</Text>
                </Container>
            </Container>

        </Column>
    )
}

export default Quantity
