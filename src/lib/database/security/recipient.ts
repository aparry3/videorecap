import { EncryptedRecipient, EncryptedRecipientUpdate, NewEncryptedRecipient, NewRecipient, Recipient, RecipientUpdate } from "@/lib/@types/Recipient"
import { decrypt, encrypt } from "./security"

export const encryptNewRecipient = (recipient: NewRecipient): NewEncryptedRecipient => {
    const encryptedRecipient: NewEncryptedRecipient = {
      id: recipient.id,
      name: encrypt(recipient.name),
      addressLineOne: encrypt(recipient.addressLineOne),
      addressLineTwo: recipient.addressLineTwo ? encrypt(recipient.addressLineTwo) : undefined,
      city: encrypt(recipient.city),
      state: encrypt(recipient.state),
      country: encrypt(recipient.country),
      zipcode: encrypt(recipient.zipcode),
      email: recipient.email ? encrypt(recipient.email) : undefined,
      phone: recipient.phone ? encrypt(recipient.phone) : undefined,
      birthday: recipient.birthday ? encrypt(new Date(recipient.birthday).toUTCString()) : undefined,
    }
  
    return encryptedRecipient
  }

  export const encryptRecipientUpdate = (recipient: RecipientUpdate): EncryptedRecipientUpdate => {
    const encryptedRecipient: EncryptedRecipientUpdate = {}

    if (recipient.name) encryptedRecipient.name = encrypt(recipient.name)
    if (recipient.addressLineOne) encryptedRecipient.addressLineOne = encrypt(recipient.addressLineOne)
    if (recipient.addressLineTwo) encryptedRecipient.addressLineTwo = encrypt(recipient.addressLineTwo)
    if (recipient.city) encryptedRecipient.city = encrypt(recipient.city)
    if (recipient.state) encryptedRecipient.state = encrypt(recipient.state)
    if (recipient.country) encryptedRecipient.country = encrypt(recipient.country)
    if (recipient.zipcode) encryptedRecipient.zipcode = encrypt(recipient.zipcode)
    if (recipient.email) encryptedRecipient.email = encrypt(recipient.email)
    if (recipient.phone) encryptedRecipient.phone = encrypt(recipient.phone)
    if (recipient.birthday) encryptedRecipient.birthday = encrypt(new Date(recipient.birthday).toUTCString())
  
    return encryptedRecipient
  }

  
  export const decryptRecipient = (recipient: EncryptedRecipient): Recipient => {

    const encryptedRecipient: Recipient = {
      id: recipient.id,
      name: decrypt(recipient.name),
      addressLineOne: decrypt(recipient.addressLineOne),
      addressLineTwo: recipient.addressLineTwo ? decrypt(recipient.addressLineTwo) : undefined,
      city: decrypt(recipient.city),
      state: decrypt(recipient.state),
      country: recipient.country ? decrypt(recipient.country) : '',
      zipcode: recipient.zipcode ? decrypt(recipient.zipcode) : '',
      email: recipient.email ? decrypt(recipient.email) : undefined,
      phone: recipient.phone ? decrypt(recipient.phone) : undefined,
      birthday: recipient.birthday ? new Date(decrypt(recipient.birthday)) : undefined,
    }
  
    return encryptedRecipient
  }
  
  
  