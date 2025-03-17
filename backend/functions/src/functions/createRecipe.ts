import {logger} from 'firebase-functions'
import {firestore, onAIToolRequest, onCallWithSecretKey, Request} from '../FirebaseInit'
import {CreateRecipeRequest, CreateRecipeResponse} from '../types/CreateRecipe.d'
import {RecipeDBModel, RecipeIngredient, RecipePreparation} from '../types/recipe.d'
import {Timestamp} from 'firebase-admin/firestore'
import {CreateRecipeRequestSchema} from '../types/CreateRecipeRequestSchema'

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

const createRecipeFunction = async (recipeData: RecipeDBModel) => {
    // Map the input data to the database model
    const recipeToStore = mapToRecipeDBModel(recipeData)

    // Store in Firestore
    const recipeRef = await firestore.collection('recipes').add(recipeToStore)
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
    }
)

export const createRecipeTool = onAIToolRequest(CreateRecipeRequestSchema, async (request: CreateRecipeRequest) => {
    const newRecipe = await createRecipeFunction(request.recipe)
    return newRecipe
})
