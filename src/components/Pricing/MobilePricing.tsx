"use client";
import { QUANTITY_PRICE_MAP, calculateTotal, promoApplies } from "@/lib/payments/cardPricing"
import Table, { TableCell, TableRow } from "../utils/Table"
import Text from '../utils/Text'
import { MAIL_METHOD_MAP, MailMethod } from "@/lib/@types/Card"
import { FC, useState } from "react"
import Container from "../utils/Container/Container"
import styles from './Pricing.module.scss'
import Column from "../utils/Container/Column"
import Button from "../utils/Button"
import { Promo } from "@/lib/@types/Promo";



const MobilePricing: FC<{promo?: Promo}> = ({promo}) => {
    const [mailMethod, setMailMethod] = useState<MailMethod>(MailMethod.NO_ENVELOPE)

    return (
        <Column className={styles.mobilePricing}>
            <Column style={{width: '100%'}}>
                <Container style={{width: '100%'}}>
                    <Button style={{width: '100%'}} border onClick={() => setMailMethod(MailMethod.NO_ENVELOPE)} inverted={mailMethod === MailMethod.NO_ENVELOPE}>{MAIL_METHOD_MAP[MailMethod.NO_ENVELOPE]}</Button>
                </Container>
                <Container style={{width: '100%'}}>
                    <Button style={{width: '100%'}} border onClick={() => setMailMethod(MailMethod.ENVELOPE)} inverted={mailMethod === MailMethod.ENVELOPE}>{MAIL_METHOD_MAP[MailMethod.ENVELOPE]}</Button>
                </Container>
                <Container style={{width: '100%'}}>
                    <Button style={{width: '100%'}} border onClick={() => setMailMethod(MailMethod.SET)} inverted={mailMethod === MailMethod.SET}>{MAIL_METHOD_MAP[MailMethod.SET]}</Button>
                </Container>
                <Container style={{width: '100%'}}>
                    <Button style={{width: '100%'}} border onClick={() => setMailMethod(MailMethod.AT_HOME)} inverted={mailMethod === MailMethod.AT_HOME}>{MAIL_METHOD_MAP[MailMethod.AT_HOME]}</Button>
                </Container>
            </Column>
            <Container >
                <Table>
                    <TableRow>
                        <TableCell><Text weight={600}>Number of Cards</Text></TableCell>
                        <TableCell><Text weight={600}>{MAIL_METHOD_MAP[mailMethod]}</Text></TableCell>
                    </TableRow>
                    {Object.keys(QUANTITY_PRICE_MAP).map(k => QUANTITY_PRICE_MAP[Number(k)][mailMethod] && (
                    <TableRow key={k}>
                        <TableCell><Text weight={500}>{k}</Text></TableCell>
                        <TableCell>
                            {(promo && promoApplies(promo, Number(k))) && (
                                <Text weight={500}>
                                    ${calculateTotal(QUANTITY_PRICE_MAP[Number(k)][mailMethod]!, promo, Number(k)) / 100} <Text weight={300} size={0.8}>/ea</Text>
                                </Text>
                            )}
                            <Text style={{textDecoration: promo && promoApplies(promo, Number(k)) ? 'line-through' : 'none' }} weight={500}>
                                ${QUANTITY_PRICE_MAP[Number(k)][mailMethod]! / 100}
                                <Text weight={400} size={0.9}>/ea</Text>
                            </Text>
                        </TableCell>
                    </TableRow>
                    ))}
                </Table>

            </Container>
        </Column>
    )
}

export default MobilePricing