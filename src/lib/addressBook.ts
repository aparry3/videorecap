import OpenAI from 'openai'
import { NewRecipient } from './@types/Recipient';

const key = process.env.OPENAI_API_KEY

if (!key) {
    throw new Error("Missing OPENAI_API_KEY")
}
const openai = new OpenAI();

interface ParsedAddressRow {
    valid: boolean,
    address: Partial<NewRecipient>
}

export const getAddressFromRow = async (row: string, header: string): Promise<string | null> => {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output JSON.",
            },
            {
                role: "user",
                content: "I have a row from an address book spreadsheet. The person's name is usually 'first,last', 'last,first', or 'first last', but is sometimes stored some other way as well. The row may also include some value like 'The Parry Family' or 'Mr. and Mrs. Parry' and in and this case, this value name should be used for the name. Please remove commas from names (for example, 'Aaron,Parry' or 'Aaron, Parry' should be 'Aaron Parry'."
            },
            {
                role: "user",
                content: "As long as the row contains a name, set valid = true. If so, populate as much of 'address' as you can."
            },
            {
                role: "user",
                content: "The address should have the format {valid: boolean, address?: {name: string, addressLineOne: string, addressLineTwo?: string, city: string, state: string, country: string, zipcode: string}}"
            },
            {
                role: "user",
                content: `The header row is: ${header}`
            },
            {
                role: "user",
                content: `The row: ${row}`
            },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: { type: "json_object" },
        seed: 1,
        
    }, {timeout: 10000});

    return completion.choices[0].message.content;
}

export const parseAddresses = async (rows: string[]): Promise<ParsedAddressRow[]> => {
    const header = rows.splice(0, 1)[0]
    const rowPromises = rows.map(row => getAddressFromRow(row, header).then(v => v).catch(e => {console.error(e.message); return null}))
    const addresses = await Promise.all(rowPromises)

    
    const jsonAddresses = addresses.filter(a => a !== null).map(a => JSON.parse(a!))

    return jsonAddresses
}
