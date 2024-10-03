import { MailMethod } from "../@types/Card";
import { Promo } from "../@types/Promo";


export type CardPriceMapType = Record<MailMethod, {[key: number]: number}>

export const CARD_PRICE_MAP: CardPriceMapType = {
    [MailMethod.NO_ENVELOPE]: {
        1: 299,
        10: 199,
    },
    [MailMethod.ENVELOPE]: {
        1: 449,
        10: 349,
    },
    [MailMethod.AT_HOME]: {
        1: 299
    },
    [MailMethod.SET]: {
        1: 449,
        10: 349,
    },
}

export type QuantityPriceMapType = Record<number, [number, number, number, number?]>

export const QUANTITY_PRICE_MAP: QuantityPriceMapType = {
    1: [299, 449, 449, 299],
    10: [199, 349, 349, undefined],
}

export const promoApplies = (promo?: Promo, quantity: number = 0) => {
    return promo !== undefined && (!promo.minOrderQuantity || quantity >= promo.minOrderQuantity)
}

export const calculateTotal = (price: number, promo?: Promo, quantity: number = 0) => {
    if (promo && promoApplies(promo, quantity)) {
        return Math.floor(price * (100 - promo.amount) / 100)
    }
    return price
}

export const getPrice = (mailMethod: MailMethod, quantity: number) => {
    const unitPrice = getUnitPrice(mailMethod, quantity)
    return unitPrice * quantity
}

export const getUnitPrice = (mailMethod: MailMethod, quantity: number): number => {
    const priceMap = CARD_PRICE_MAP[mailMethod]
    const thresholds = Object.keys(priceMap).map(k => Number(k))
    let unitPrice = priceMap[thresholds[0]]
    thresholds.forEach(t => {
        if (quantity >= t) {
            unitPrice = priceMap[t]
        }
    })

    return unitPrice
}