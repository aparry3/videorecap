import { google, sheets_v4 } from 'googleapis';
import { GaxiosResponse } from 'gaxios';
import { Card, MailMethod } from '../@types/Card';
import { Recipient } from '../@types/Recipient';
import { spread } from 'axios';

const ORDER_HEADERS = ['Timestamp', 'Order Type', 'ID', 'URL', 'Email', 'Quantity', 'Total', 'Created', 'Campaign'];

async function authenticateSheetsAPI() {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_PROJECT_ID) {
        throw new Error('GOOGLE CREDENTIALS MISSING')
    }
    const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        project_id: process.env.GOOGLE_PROJECT_ID
      };
  
      // Configure a JWT client with the service account email, private key, and necessary scopes
      const client = new google.auth.JWT(
        credentials.client_email,
        undefined,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      const sheets = google.sheets({ version: 'v4', auth: client });

      return sheets;
    }
  
// Function to check if a sheet with today's date exists and create one if it doesn't
async function ensureSheetExists(spreadsheetId: string, sheets: sheets_v4.Sheets, headers: string[]): Promise<string> {
    const date = new Date();
    // const sheetTitle = `ORDERS_${date.toISOString().split('T')[0]}`; // Format as 'ORDERS_YYYY-MM-DD'
    const sheetTitle = `Orders_${date.getFullYear().toString()}`; // '

    const sheetMetadata = await sheets.spreadsheets.get({
        spreadsheetId
    });
    

    const sheetsTitles = sheetMetadata.data.sheets?.map(sheet => sheet.properties?.title);

    if (!sheetsTitles?.includes(sheetTitle)) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                {
                    addSheet: {
                    properties: {
                        title: sheetTitle,
                    },
                    },
                },
                ],
            },
        });

        // Add the header row to the newly created sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetTitle}!A1:I1`, // Assuming headers fit into columns A to G
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [headers],
            },
        });
        console.log(`Header row added to sheet: ${sheetTitle}`);
    } else {
        console.log(`Sheet with title: ${sheetTitle} already exists.`);
    }

    return sheetTitle; // Return the title of the sheet to be used for appending data

}

const formatAddressString = (recipient: Recipient): string => {
    return `${recipient.addressLineOne}, ${recipient.addressLineTwo ? ', '+recipient.addressLineTwo : ''}\n${recipient.city}, ${recipient.state}, ${recipient.zipcode}\n${recipient.zipcode}`
}

// Function to add a card to a Google Sheet, modified to ensure the sheet exists
export async function addEnvelopeOrderToGoogleSheet(card: Card, quantity: number) {
    const spreadsheetId = process.env.ENVELOPE_ORDERS_SHEET || ''
    
    console.log(`ENVELOPE SPREADSHEET_ID: ${spreadsheetId}`)

    const sheets = await authenticateSheetsAPI();

    const headers = ['ID', 'URL', 'Email', 'Quantity', 'Printed', 'Mailed', 'Type'];

    // Ensure the sheet for today exists
    console.log(`ENSURE SHEET: ${spreadsheetId}`)
    const sheetTitle = await ensureSheetExists(spreadsheetId, sheets, headers);

    console.log(`SHEET TITLE: ${sheetTitle}`)

    const values = [
        [card.id, `${process.env.BASE_URL}/process/${card.id}`, card.email, quantity, false, false, card.mailMethod === MailMethod.ENVELOPE ? 'individual' : 'set']
    ]

    const resource: sheets_v4.Params$Resource$Spreadsheets$Values$Append = {
        spreadsheetId,
        range: `${sheetTitle}!A1`, // Append to the sheet with today's date
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values
        },
    };

    try {
        console.log(`ADD VALUES: ${sheetTitle}`)

        const response: GaxiosResponse<sheets_v4.Schema$AppendValuesResponse> = await sheets.spreadsheets.values.append(resource);
        console.log('Row added:', response.data);
    } catch (err) {
        console.error('ERROR ADDING ROW:', err);
    }
}

export async function addOrderToGoogleSheet(card: Card, total?: number, quantity?: number) {
    const spreadsheetId = process.env.ORDERS_SHEET || ''
    
    console.log(`ORDER SPREADSHEET_ID: ${spreadsheetId}`)

    const sheets = await authenticateSheetsAPI();

    // Ensure the sheet for today exists
    console.log(`ENSURE SHEET: ${spreadsheetId}`)
    const sheetTitle = await ensureSheetExists(spreadsheetId, sheets, ORDER_HEADERS);

    console.log(`ORDER SHEET TITLE: ${sheetTitle}`)
    console.log(card)
    const val =  [new Date(), card.mailMethod, card.id, `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation/${card.id}`, card.email, quantity ?? 0, total ?? 0, card.modified]
    const values = [
       val
    ]

    const resource: sheets_v4.Params$Resource$Spreadsheets$Values$Append = {
        spreadsheetId,
        range: `${sheetTitle}!A1`, // Append to the sheet with today's date
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values
        },
    };

    try {
        console.log(`ADD VALUES: ${sheetTitle}`)

        const response: GaxiosResponse<sheets_v4.Schema$AppendValuesResponse> = await sheets.spreadsheets.values.append(resource);
        console.log('Row added:', response.data);
    } catch (err) {
        console.error('ERROR ADDING ROW:', err);
    }
}

export async function addCampaignOrderToGoogleSheets(id: string, email: string, code: string, total: number) {
    const spreadsheetId = process.env.ORDERS_SHEET || ''
    
    console.log(`ORDER SPREADSHEET_ID: ${spreadsheetId}`)

    const sheets = await authenticateSheetsAPI();

    // Ensure the sheet for today exists
    console.log(`ENSURE SHEET: ${spreadsheetId}`)
    const sheetTitle = await ensureSheetExists(spreadsheetId, sheets, ORDER_HEADERS);

    console.log(`ORDER SHEET TITLE: ${sheetTitle}`)
    const val =  [new Date(), 'CREATOR', id, `${process.env.NEXT_PUBLIC_BASE_URL}/creators/${id}`, email, 1, total, '', code]
    const values = [
       val
    ]

    const resource: sheets_v4.Params$Resource$Spreadsheets$Values$Append = {
        spreadsheetId,
        range: `${sheetTitle}!A1`, // Append to the sheet with today's date
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values
        },
    };

    try {
        console.log(`ADD VALUES: ${sheetTitle}`)

        const response: GaxiosResponse<sheets_v4.Schema$AppendValuesResponse> = await sheets.spreadsheets.values.append(resource);
        console.log('Row added:', response.data);
    } catch (err) {
        console.error('ERROR ADDING ROW:', err);
    }
}



// ... (rest of your code, including example usage)
