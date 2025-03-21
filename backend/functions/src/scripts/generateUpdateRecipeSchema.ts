import * as fs from 'fs'
import * as path from 'path'
import { zodToJsonSchema } from 'zod-to-json-schema'

import { UpdateRecipeRequestSchema } from '../types/UpdateRecipeRequestSchema'

// Generate JSON Schema
const jsonSchema = zodToJsonSchema(UpdateRecipeRequestSchema, {
    $refStrategy: 'none',
    name: 'UpdateRecipeRequest',
})

// Write the schema to a file
const outputDir = path.resolve(__dirname, '../../schemas')
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
}

const outputPath = path.join(outputDir, 'updateRecipeSchema.json')
fs.writeFileSync(outputPath, JSON.stringify(jsonSchema.definitions?.UpdateRecipeRequest, null, 2))

console.log(`JSON Schema generated successfully at: ${outputPath}`)
