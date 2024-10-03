import { FC } from "react"
import Container from "../utils/Container/Container"
import Text from "../utils/Text"
import Column from "../utils/Container/Column"
import Table, { TableCell, TableRow } from "../utils/Table"
import styles from './Pricing.module.scss'
import { QUANTITY_PRICE_MAP, calculateTotal, promoApplies } from "@/lib/payments/cardPricing"
import { MAIL_METHOD_MAP, MailMethod } from "@/lib/@types/Card"
import MobilePricing from "./MobilePricing"
import { Promo } from "@/lib/@types/Promo"


const Pricing: FC<{promo?: Promo}> = ({promo}) => {
    return (
        <Container padding style={{width: '100%', overflow: 'auto', alignItems: 'flex-start', height: '100%', flexGrow: 1}}>
            <Column className={styles.pricingBlock} padding>
                <Container padding>
                    <Text weight={600} size={1.3}>Pricing</Text>
                </Container>
                {promo && (
                <Container padding>
                    <Text >PROMO APPLIED: <Text weight={600}>{promo.id}.</Text> Amount <Text weight={600}>{promo.amount}%</Text>{promo.minOrderQuantity && promo.minOrderQuantity > 0 && ` on orders of ${promo.minOrderQuantity} or more.`}</Text>
                </Container>
                )}
                <Container className={styles.desktopPricing}>
                    <Table>
                        <TableRow>
                            <TableCell><Text weight={600}>Number of Cards</Text></TableCell>
                            <TableCell><Text weight={600}>{MAIL_METHOD_MAP[MailMethod.NO_ENVELOPE]}</Text></TableCell>
                            <TableCell><Text weight={600}>{MAIL_METHOD_MAP[MailMethod.ENVELOPE]}</Text></TableCell>
                            <TableCell><Text weight={600}>{MAIL_METHOD_MAP[MailMethod.SET]}</Text></TableCell>
                            <TableCell><Text weight={600}>{MAIL_METHOD_MAP[MailMethod.AT_HOME]}</Text></TableCell>
                        </TableRow>
                        {Object.keys(QUANTITY_PRICE_MAP).map(k => (
                        <TableRow key={k}>
                            <TableCell>
                                <Text weight={500}>{k}</Text>
                            </TableCell>
                            <TableCell>
                                {(promo && promoApplies(promo, Number(k))) && (
                                <Text weight={500}>
                                    ${calculateTotal(QUANTITY_PRICE_MAP[Number(k)][MailMethod.NO_ENVELOPE], promo, Number(k)) / 100} <Text weight={300} size={0.8}>/ea</Text>
                                </Text>
                                )}
                                <Text weight={500} style={{textDecoration: promo && promoApplies(promo, Number(k)) ? 'line-through' : 'none'}}>
                                    ${QUANTITY_PRICE_MAP[Number(k)][MailMethod.NO_ENVELOPE] / 100} <Text weight={300} size={0.8}>/ea</Text>
                                </Text>
                                </TableCell>
                            <TableCell>
                                {(promo && promoApplies(promo, Number(k))) && (
                                <Text weight={500}>
                                    ${calculateTotal(QUANTITY_PRICE_MAP[Number(k)][MailMethod.ENVELOPE], promo, Number(k)) / 100} <Text weight={300} size={0.8}>/ea</Text>
                                </Text>
                                )}
                                <Text weight={500} style={{textDecoration: promo && promoApplies(promo, Number(k)) ? 'line-through' : 'none'}}>
                                    ${QUANTITY_PRICE_MAP[Number(k)][MailMethod.ENVELOPE] / 100} <Text weight={300} size={0.8}>/ea</Text>
                                </Text>
                            </TableCell>
                            <TableCell>
                                {(promo && promoApplies(promo, Number(k))) && (
                                <Text weight={500}>
                                    ${calculateTotal(QUANTITY_PRICE_MAP[Number(k)][MailMethod.SET], promo, Number(k)) / 100} <Text weight={300} size={0.8}>/ea</Text>
                                </Text>
                                )}
                                <Text weight={500} style={{textDecoration: promo && promoApplies(promo, Number(k)) ? 'line-through' : 'none'}}>
                                    ${QUANTITY_PRICE_MAP[Number(k)][MailMethod.SET] / 100} <Text weight={300} size={0.8}>/ea</Text>
                                </Text>
                            </TableCell>
                            <TableCell>
                                {QUANTITY_PRICE_MAP[Number(k)][MailMethod.AT_HOME] !== undefined && (
                                    <>
                                    {(promo && promoApplies(promo, Number(k))) && (
                                    <Text weight={500}>
                                        ${calculateTotal(QUANTITY_PRICE_MAP[Number(k)][MailMethod.AT_HOME]!!, promo, Number(k)) / 100} <Text weight={300} size={0.8}>/ea</Text>
                                    </Text>
                                    )}                                        
                                    <Text weight={500} style={{textDecoration: promo && promoApplies(promo, Number(k)) ? 'line-through' : 'none'}}>
                                        ${QUANTITY_PRICE_MAP[Number(k)][MailMethod.AT_HOME]! / 100} <Text weight={300} size={0.8}>/ea</Text>
                                    </Text>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                        ))}
                    </Table>
                </Container>
                <MobilePricing promo={promo}/>
            </Column>
        </Container>
    )
}

export default Pricing