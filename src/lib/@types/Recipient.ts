import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface RecipientTable {
    id: Generated<number>
    name: string
    addressLineOne: string
    addressLineTwo?: string | null
    city: string
    state: string
    country: string
    zipcode: string
    email?: string
    phone?: string
    birthday?: Date
}

export interface EncryptedRecipientTable {
  id: Generated<number>
  name: string
  addressLineOne: string
  addressLineTwo?: string | null
  city: string
  state: string
  country: string
  zipcode: string
  email?: string
  phone?: string
  birthday?: string
}


export type Recipient = Selectable<RecipientTable>
export type NewRecipient = Insertable<RecipientTable>
export type RecipientUpdate = Updateable<RecipientTable>

export type EncryptedRecipient = Selectable<EncryptedRecipientTable>
export type NewEncryptedRecipient = Insertable<EncryptedRecipientTable>
export type EncryptedRecipientUpdate = Updateable<EncryptedRecipientTable>


export interface StripeRecipientDetails {
    name: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    phone?: string;
  };

export const fromStripeAddress = (recipientDetails: StripeRecipientDetails): NewRecipient => {
    return {
        email: recipientDetails.email,
        name: recipientDetails.name,
        addressLineOne: recipientDetails.address.line1,
        addressLineTwo: recipientDetails.address.line2,
        city: recipientDetails.address.city,
        state: recipientDetails.address.state,
        country: recipientDetails.address.country,
        zipcode: recipientDetails.address.postal_code,
        phone: recipientDetails.phone,
    }
  }
