import { logger } from 'firebase-functions'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'

import { RecipeWithIngredients, nullToUndefined } from '@tipi/shared'

import { onFunctionsInit } from '../firebase/OnFunctionsInit'
import { UpdateRecipeRequest } from '../types/UpdateRecipe'
import { UpdateRecipeRequestSchema } from '../types/UpdateRecipeRequestSchema'

// Initialize OpenAI client
let openai: OpenAI

onFunctionsInit(() => {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_SECRET_KEY,
    })
})

/**
 * Generates recipe update payload using OpenAI
 * @param {string} changes - The changes to search for
 * @param {RecipeWithIngredients[]} recipes - The similar recipes
 * @return {Promise<UpdateRecipeRequest>} The update payload
 */
export const generateUpdatePayload = async (
    changes: string,
    recipes: RecipeWithIngredients[],
): Promise<UpdateRecipeRequest> => {
    if (!openai) {
        throw new Error('OpenAI client not initialized - check OPENAI_SECRET_KEY environment variable')
    }

    try {
        const systemPrompt = `
Eres un asistente que ayuda a cambiar los datos de una receta.

Dada una lista de [recetas] y los [cambios], quiero que extraigas cuáles son los campos concretos a modificar y cuál es el nuevo valor de los campos. Dame un JSON que solo tenga los campos a cambiar y sus valores.

Te daré varias recetas y quiero que elijas solo 1, la que crees que hay que modificar según los [cambios].

El JSON debe seguir estrictamente el esquema de la solicitud UpdateRecipeRequest. 
Debe incluir:
- "id" (string): ID de la receta a actualizar
- "ingredientsToRemove" (array de strings): IDs de los ingredientes a eliminar
- Y cualquier otro campo que deba actualizarse como name, category, allergens, etc.
        `

        const completion = await openai.beta.chat.completions.parse({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: `[Recetas]: ${JSON.stringify(recipes)}\n\n[Cambios]: ${changes}`,
                },
            ],
            temperature: 0,
            response_format: zodResponseFormat(UpdateRecipeRequestSchema, 'updateRecipe'),
        })

        logger.info('OpenAI response parsed successfully', { parsedContent: completion.choices[0].message.parsed })
        return nullToUndefined(completion.choices[0].message.parsed!)
    } catch (error) {
        logger.error(`Error calling OpenAI: ${error}`)
        throw new Error(`Error generating update payload: ${error}`)
    }
}
