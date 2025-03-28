const { Command } = require('commander')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const callLocalFunction = new Command('call-local-function')
    .description('Call a local cloud function with data from a JSON file')
    .option('-f, --file <path>', 'Path to the JSON file containing the tool call data', '.local/toolCall.json')
    .option('-e, --endpoint <name>', 'The name of the cloud function endpoint to call')
    .option('-s, --secret <key>', 'The server secret key to use in the x-server-secret-key header')
    .action(async options => {
        try {
            // Validate endpoint
            if (!options.endpoint) {
                console.error('Error: You must specify an endpoint name with --endpoint')
                process.exit(1)
            }

            console.log('Current working directory:', process.cwd())

            // Read the JSON file
            const filePath = path.resolve(process.cwd(), options.file)
            if (!fs.existsSync(filePath)) {
                console.error(`Error: File not found at ${filePath}`)
                process.exit(1)
            }

            const fileContent = fs.readFileSync(filePath, 'utf8')
            const toolCallData = JSON.parse(fileContent)

            // Validate data structure
            if (
                !toolCallData.message ||
                !toolCallData.message.toolCalls ||
                !Array.isArray(toolCallData.message.toolCalls)
            ) {
                console.error('Error: Invalid tool call data format in the JSON file')
                process.exit(1)
            }

            // Construct the URL for the cloud function
            const baseUrl = `http://localhost:5008/tipi-ink/europe-west3/${options.endpoint}`

            // Get the secret key from options, environment variable, or prompt user
            const secretKey = options.secret || process.env.SERVER_SECRET_KEY

            if (!secretKey) {
                console.warn(
                    'Warning: No server secret key provided. The request might fail if authentication is required.',
                )
            }

            // Create headers with the secret key if available
            const headers = secretKey ? { 'x-server-secret-key': secretKey } : {}

            console.log(`Calling cloud function at: ${baseUrl}`)
            console.log('With data:', JSON.stringify(toolCallData, null, 2))

            // Make the HTTP request to the cloud function with the secret key header
            const response = await axios.post(baseUrl, toolCallData, { headers })

            console.log('Cloud function response:')
            console.log(JSON.stringify(response.data, null, 2))
        } catch (error) {
            console.error('Error calling cloud function:', error.message)
            if (error.response) {
                console.error('Response status:', error.response.status)
                console.error('Response data:', error.response.data)
            }
            process.exit(1)
        }
    })

module.exports = callLocalFunction
