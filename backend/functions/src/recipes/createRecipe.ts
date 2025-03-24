import { Timestamp } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'

import { Request, firestore, onAIToolRequest, onCallWithSecretKey } from '../FirebaseInit'
import { CreateRecipeRequest, CreateRecipeResponse } from '../types/CreateRecipe'
import { CreateRecipeRequestSchema } from '../types/CreateRecipeRequestSchema'
import { UpdateRecipeRequest } from '../types/UpdateRecipe'
import { UpdateRecipeRequestSchema } from '../types/UpdateRecipeRequestSchema'
import { RecipeDBModel, RecipeIngredientDBModel, RecipePreparation } from './recipe'

const mapToRecipeIngredient = (ingredient: Partial<RecipeIngredientDBModel>): RecipeIngredientDBModel => {
    // Define default values for required fields
    const defaultIngredient: RecipeIngredientDBModel = {
        name: '',
        quantityPerProduction: 0,
        unit: '',
        pricePerUnit: 0,
    }

    // Extract only the fields that should be stored in the database
    const { name, quantityPerProduction, unit, pricePerUnit } = {
        ...defaultIngredient,
        ...ingredient,
    }

    // Return the mapped ingredient with only the desired fields
    return {
        name,
        quantityPerProduction,
        unit,
        pricePerUnit,
    }
}

const mapToRecipeDBModel = (recipeData: CreateRecipeRequest['recipe']): RecipeDBModel => {
    // Define default values for required fields
    const createdAt = Timestamp.now()
    const recipe: RecipeDBModel = {
        name: recipeData.name || '',
        category: recipeData.category,
        allergens: recipeData.allergens ?? [],
        productionTime: recipeData.productionTime,
        pvp: recipeData.pvp ?? 0,
        servingsPerProduction: recipeData.servingsPerProduction ?? 1,
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

const createRecipeFunction = async (recipeData: CreateRecipeRequest['recipe']) => {
    // Map the input data to the database model
    const recipeToStore = mapToRecipeDBModel(recipeData)

    // Store in Firestore
    const recipeRef = await firestore.collection('organizations/demo/recipes').add(recipeToStore)
    const recipe = await recipeRef.get()
    const newRecipe = recipe.data() as RecipeDBModel

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
    },
)

export const createRecipeTool = onAIToolRequest(CreateRecipeRequestSchema, async (request: CreateRecipeRequest) => {
    const newRecipe = await createRecipeFunction(request.recipe)
    return newRecipe
})

const unifyIngredients = (
    existingIngredients: RecipeIngredientDBModel[],
    ingredientsToRemove: string[],
    newIngredients: Partial<RecipeIngredientDBModel>[],
) => {
    if (!newIngredients) {
        return existingIngredients
    }
    const ingredientsToStore = existingIngredients.filter(ingredient => !ingredientsToRemove.includes(ingredient.name))
    for (const ingredient of newIngredients) {
        const existingIngredient = ingredientsToStore.find(i => i.name === ingredient.name)
        if (existingIngredient) {
            const updatedIngredient: RecipeIngredientDBModel = {
                // Just to get the help of the type checker
                name: ingredient.name ?? existingIngredient.name,
                unit: ingredient.unit ?? existingIngredient.unit,
                quantityPerProduction: ingredient.quantityPerProduction ?? existingIngredient.quantityPerProduction,
                pricePerUnit: ingredient.pricePerUnit ?? existingIngredient.pricePerUnit,
            }

            existingIngredient.name = updatedIngredient.name
            existingIngredient.unit = updatedIngredient.unit
            existingIngredient.quantityPerProduction = updatedIngredient.quantityPerProduction
            existingIngredient.pricePerUnit = updatedIngredient.pricePerUnit
        } else {
            ingredientsToStore.push(mapToRecipeIngredient(ingredient))
        }
    }
    logger.info({ existingIngredients, ingredientsToRemove, newIngredients, ingredientsToStore })
    return ingredientsToStore
}

const unifyPreparation = (existingPreparation: RecipePreparation, newPreparation: Partial<RecipePreparation>) => {
    return {
        ...existingPreparation,
        ...newPreparation,
    }
}
const updateRecipeFunction = async (recipeData: UpdateRecipeRequest) => {
    const recipeRef = firestore.collection('organizations/demo/recipes').doc(recipeData.id)
    const recipeRefData = await recipeRef.get()
    if (!recipeRefData.exists) {
        throw new Error('Recipe with id ' + recipeData.id + ' not found')
    }
    const recipe = recipeRefData.data() as RecipeDBModel
    logger.info('Updating recipe', { oldRecipe: recipe, newRecipeDetails: recipeData })

    const newRecipe = {
        ...recipe,
        ...recipeData,
        ingredients: unifyIngredients(
            recipe.ingredients,
            recipeData.ingredientsToRemove || [],
            recipeData.ingredients || [],
        ),
        preparation: unifyPreparation(recipe.preparation, recipeData.preparation || {}),
    }

    await recipeRef.update({
        ...newRecipe,
        updatedAt: Timestamp.now(),
    })

    return recipeRef
}

export const updateRecipeTool = onAIToolRequest(UpdateRecipeRequestSchema, async (request: UpdateRecipeRequest) => {
    const updatedRecipe = await updateRecipeFunction(request)
    return updatedRecipe
})
