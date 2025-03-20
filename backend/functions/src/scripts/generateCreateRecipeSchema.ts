import * as fs from 'fs'
import * as path from 'path'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { CreateRecipeRequestSchema } from '../types/CreateRecipeRequestSchema'

// Generate JSON Schema
const jsonSchema = zodToJsonSchema(CreateRecipeRequestSchema, {
    $refStrategy: 'none',
    name: 'CreateRecipeRequest',
})

// Write the schema to a file
const outputDir = path.resolve(__dirname, '../../schemas')
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
}

const outputPath = path.join(outputDir, 'createRecipeSchema.json')
fs.writeFileSync(outputPath, JSON.stringify(jsonSchema.definitions?.CreateRecipeRequest, null, 2))

console.log(`JSON Schema generated successfully at: ${outputPath}`)
