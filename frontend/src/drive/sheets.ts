const spreadsheetId = '1v0B6D3CQiXc7prY8aNDF7f1O_TajNMw6t-pqhqV90LA'
export const getSpreadSheetData = async () => {
    const range = '18-OCT!A1:D10'  // Define the range you want to fetch

    try {

        // Fetch the spreadsheet data
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        })

        console.log('Spreadsheet Data:', response.result)
    } catch (error) {
        console.error('Error fetching spreadsheet data:', error)
    }
}


export async function updateSpreadsheetData(range: string, value: string) {
    try {
        const params = {
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED'
        }

        const valueRangeBody = {
            range: range,
            values: [
                [value]
            ]
        }

        // Update the spreadsheet data
        const response = await gapi.client.sheets.spreadsheets.values.update({
            ...params,
            resource: valueRangeBody
        })

        console.log('Update response:', response)
    } catch (error) {
        console.error('Error updating spreadsheet data:', error)
    }
}
