let currentAccessToken: string | undefined
const authenticate = async () => {

    if(currentAccessToken) {
        return // Already authenticated
    }

    return new Promise<void>((resolve, reject) => {
        // @ts-expect-error google is available
        const client = google.accounts.oauth2.initTokenClient({
            client_id: '634165171036-g9267dd6aeonjg8k0di298iqt6dfn716.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            callback: (tokenResponse: any) => {
                console.log('Token response:', {tokenResponse})
                if (tokenResponse && tokenResponse.access_token) {
                    currentAccessToken = tokenResponse.access_token
                    gapi.client.setToken({access_token: tokenResponse.access_token})
                    setTimeout(() => {currentAccessToken = undefined}, 3_500_000) // Life time of the token is 3566s
                    resolve()
                } else {
                    reject('Error getting access token')
                }
            },
        })
        client.requestAccessToken()
    })

}

const spreadsheetId = '1v0B6D3CQiXc7prY8aNDF7f1O_TajNMw6t-pqhqV90LA'
export const getSpreadSheetData = async () => {
    await authenticate()
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
    await authenticate()
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
