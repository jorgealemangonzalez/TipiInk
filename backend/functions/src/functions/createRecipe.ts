import {Timestamp} from 'firebase-admin/firestore'
import {logger} from 'firebase-functions'
import {firestore, isLocalEnvironment, onAIToolRequest, onCallWithSecretKey, Request} from '../FirebaseInit'
import {CreateRecipeRequest, CreateRecipeResponse} from '../types/CreateRecipe.d'
import {CreateRecipeRequestSchema} from '../types/CreateRecipeRequestSchema'
import {RecipeDBModel, RecipeIngredient, RecipePreparation} from '../types/recipe.d'
import {ChunkMetadata, TrieveSDK} from 'trieve-ts-sdk'
import {UpdateRecipeRequestSchema} from '../types/UpdateRecipeRequestSchema'
import {UpdateRecipeRequest} from '../types/UpdateRecipe'

const mapToRecipeIngredient = (ingredient: Partial<RecipeIngredient>): RecipeIngredient => {
    // Define default values for required fields
    const defaultIngredient: RecipeIngredient = {
        name: '',
        quantityPerProduction: 0,
        unit: '',
        quantityPerServing: 0,
        pricePerUnit: 0,
        pricePerProduction: 0,
    }

    // Extract only the fields that should be stored in the database
    const {name, quantityPerProduction, unit, quantityPerServing, pricePerUnit, pricePerProduction} = {
        ...defaultIngredient,
        ...ingredient,
    }

    // Return the mapped ingredient with only the desired fields
    return {
        name,
        quantityPerProduction,
        unit,
        quantityPerServing,
        pricePerUnit,
        pricePerProduction,
    }
}

const mapToRecipeDBModel = (recipeData: Partial<RecipeDBModel>): RecipeDBModel => {
    // Define default values for required fields
    const createdAt = Timestamp.now()
    const recipe: RecipeDBModel = {
        name: recipeData.name || '',
        allergens: recipeData.allergens ?? [],
        pvp: recipeData.pvp ?? 0,
        costPerServing: recipeData.costPerServing ?? 0,
        servingsPerProduction: recipeData.servingsPerProduction ?? 1,
        productionCost: recipeData.productionCost ?? 0,
        priceVariation: recipeData.priceVariation ?? 0,
        inMenu: recipeData.inMenu ?? false,
        ingredients: recipeData.ingredients?.map(mapToRecipeIngredient) ?? [],
        preparation: {
            prePreparation: recipeData.preparation?.prePreparation ?? [],
            preparation: recipeData.preparation?.preparation ?? [],
            conservation: recipeData.preparation?.conservation ?? [],
        },
        createdAt,
        updatedAt: createdAt,
    }

    return recipe
}
export const trieve = new TrieveSDK({
    apiKey: process.env.TRIEVE_API_KEY || '',
    datasetId: isLocalEnvironment() ? 'c7b4534b-ed9b-40b7-8b20-268b76bf4217' : 'cd4edb52-2fcb-4e69-bd5a-8275b3a79eaa',
})

const createRecipeFunction = async (recipeData: RecipeDBModel) => {
    // Map the input data to the database model
    const recipeToStore = mapToRecipeDBModel(recipeData)

    // Store in Firestore
    const recipeRef = await firestore.collection('recipes').add(recipeToStore)
    const recipe = await recipeRef.get()
    const newRecipe = recipe.data() as RecipeDBModel

    const response = await trieve.createChunk({
        chunk_html: JSON.stringify({id: recipeRef.id, ...newRecipe}),
        metadata: {
            recipeId: recipeRef.id,
        },
    })

    await recipeRef.update({
        chunkId: (response.chunk_metadata as ChunkMetadata).id,
    })

    console.log(response)

    return newRecipe
}

export const createRecipe = onCallWithSecretKey(
    async (request: Request<CreateRecipeRequest>): Promise<CreateRecipeResponse> => {
        try {
            const recipeData = request.data.recipe
            const newRecipe = await createRecipeFunction(recipeData)
            return {
                success: true,
                recipe: newRecipe,
            }
        } catch (error) {
            logger.error('Error creating recipe:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            }
        }
    }
)

export const createRecipeTool = onAIToolRequest(CreateRecipeRequestSchema, async (request: CreateRecipeRequest) => {
    const newRecipe = await createRecipeFunction(request.recipe)
    return newRecipe
})

const unifyIngredients = (
    existingIngredients: RecipeIngredient[],
    ingredientsToRemove: string[],
    newIngredients: Partial<RecipeIngredient>[]
) => {
    if (!newIngredients) {
        return existingIngredients
    }
    const ingredientsToStore = existingIngredients.filter(
        (ingredient) => !ingredientsToRemove.includes(ingredient.name)
    )
    for (const ingredient of newIngredients) {
        const existingIngredient = ingredientsToStore.find((i) => i.name === ingredient.name)
        if (existingIngredient) {
            existingIngredient.quantityPerProduction =
                ingredient.quantityPerProduction ?? existingIngredient.quantityPerProduction
            existingIngredient.quantityPerServing =
                ingredient.quantityPerServing ?? existingIngredient.quantityPerServing
            existingIngredient.pricePerUnit = ingredient.pricePerUnit ?? existingIngredient.pricePerUnit
            existingIngredient.pricePerProduction =
                ingredient.pricePerProduction ?? existingIngredient.pricePerProduction
        } else {
            ingredientsToStore.push(mapToRecipeIngredient(ingredient))
        }
    }
    return ingredientsToStore
}

const unifyPreparation = (existingPreparation: RecipePreparation, newPreparation: Partial<RecipePreparation>) => {
    return {
        ...existingPreparation,
        ...newPreparation,
    }
}
const updateRecipeFunction = async (recipeData: UpdateRecipeRequest) => {
    const recipeRef = firestore.collection('recipes').doc(recipeData.id)
    const recipeRefData = await recipeRef.get()
    if (!recipeRefData.exists) {
        throw new Error('Recipe with id ' + recipeData.id + ' not found')
    }
    const recipe = recipeRefData.data() as RecipeDBModel
    logger.info('Updating recipe', {oldRecipe: recipe, newRecipeDetails: recipeData})

    const newRecipe = {
        ...recipe,
        ...recipeData,
        ingredients: unifyIngredients(
            recipe.ingredients,
            recipeData.ingredientsToRemove || [],
            recipeData.ingredients || []
        ),
        preparation: unifyPreparation(recipe.preparation, recipeData.preparation || {}),
    }

    await recipeRef.update({
        ...newRecipe,
        updatedAt: Timestamp.now(),
    })

    // store in trieve
    const response = await trieve.updateChunk({
        chunk_id: recipe.chunkId,
        chunk_html: JSON.stringify(newRecipe),
    })

    console.log('Trieve recipe updated', response)

    return recipeRef
}

export const updateRecipeTool = onAIToolRequest(UpdateRecipeRequestSchema, async (request: UpdateRecipeRequest) => {
    const updatedRecipe = await updateRecipeFunction(request)
    return updatedRecipe
})
