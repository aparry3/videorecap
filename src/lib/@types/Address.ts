export interface Address {
    addressLineOne: string
    addressLineTwo?: string | null
    city: string
    state: string
    country: string
    zipcode: string
}

export type NewAddress = Partial<Address>
