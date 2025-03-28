#!/usr/bin/env node
const { Command } = require('commander')
const { VapiClient } = require('@vapi-ai/server-sdk')

const command = new Command('vapi-tools')

command
    .description('List or manage Vapi AI tools')
    .option('--format <format>', 'Output format (json, table)', 'table')
    .option('--filter <filter>', 'Filter tools by name')
    .option('--api-key <key>', 'Override the default Vapi API key')
    .option('--detailed', 'Show detailed information for each tool', false)
    .action(async options => {
        await listVapiTools(options)
    })

async function listVapiTools(options) {
    try {
        console.log('Retrieving Vapi AI tools...')

        const vapiClient = new VapiClient({
            token: '13524839-e9ae-4b69-82c2-0cf7e561f41a',
        })

        const tools = await vapiClient.tools.list()

        const updateResponse = await vapiClient.tools.update('b036f7b6-4d76-47ff-981f-f546a64c9f3c', {
            function: {
                name: 'ActualizarReceta-Test',
                strict: true,
                description:
                    'Modifica cualquier campo de una receta existente.  \n\nCondiciones mínimas:  \n- Requiere ID válido desde la base de conocimiento.  \n- Puede actualizar uno o varios campos.  \n- Puede eliminar ingredientes de la receta.\n\nSe activa cuando el usuario dice:  \n- "guarda los cambios"  \n- "confirma"  \n- "hazlo así"  \n- "actualízala"  \n- "borra los ingredientes y pon estos"  \n\nComportamiento:  \n- No repitas los cambios antes de ejecutar.  \n- Si hay varios cambios acumulados, llama una sola vez.  \n- Si es un solo cambio (nombre, ingrediente, etc.), llama igualmente.  \n\nRespuesta esperada:  \n"La receta \\\'[nombre]\\\' se ha actualizado correctamente."  ',
                parameters: require('../../backend/functions/schemas/updateRecipeSchema.json'),
                async: false,
            },
            server: {
                url: 'https://rnbxg-62-175-50-0.a.free.pinggy.link/tipi-ink/europe-west3/updateRecipeTool',
                headers: {
                    'x-server-secret-key': 'server-secret-key',
                },
            },
        })

        console.log({ updateResponse })

        if (options.filter) {
            const filteredTools = tools.filter(
                tool => tool.name && tool.name.toLowerCase().includes(options.filter.toLowerCase()),
            )

            console.log(`Found ${filteredTools.length} tools matching "${options.filter}"`)
            outputTools(filteredTools, options.format, options.detailed)
        } else {
            console.log(`Found ${tools.length} tools`)
            outputTools(tools, options.format, options.detailed)
        }
    } catch (error) {
        console.error('Error retrieving Vapi tools:', error)
        process.exit(1)
    }
}

function outputTools(tools, format, detailed) {
    if (format === 'json') {
        console.log(JSON.stringify(tools, null, 2))
    } else {
        // Default table format
        if (detailed) {
            tools.forEach((tool, index) => {
                console.log(`\n[${index + 1}] ${tool.name}`)
                console.log(`${'='.repeat(tool.name.length + 4)}`)
                console.log(`Description: ${tool.description || 'N/A'}`)

                if (tool.parameters && Object.keys(tool.parameters).length > 0) {
                    console.log('\nParameters:')
                    Object.entries(tool.parameters).forEach(([name, details]) => {
                        console.log(
                            `  - ${name}: ${details.description || 'No description'} ${details.required ? '(Required)' : '(Optional)'}`,
                        )
                    })
                }
                console.log('\n---')
            })
        } else {
            console.table(
                tools.map(tool => ({
                    name: tool.name,
                    description: tool.description
                        ? tool.description.length > 50
                            ? tool.description.substring(0, 50) + '...'
                            : tool.description
                        : 'N/A',
                    parameters: tool.parameters ? Object.keys(tool.parameters).length : 0,
                })),
            )
        }
    }
}

module.exports = command
