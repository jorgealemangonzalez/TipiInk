import {logger} from 'firebase-functions'
import {firestore, onCallWithSecretKey, Request} from '../FirebaseInit'
import {CreateRecipeRequest, CreateRecipeResponse} from '../types/CreateRecipe.d'
import {RecipeDBModel, RecipeIngredient} from '../types/recipe.d'

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
    const defaultRecipe: RecipeDBModel = {
        name: '',
        allergens: [],
        pvp: 0,
        costPerServing: 0,
        servingsPerProduction: 1,
        productionCost: 0,
        priceVariation: 0,
        inMenu: false,
        ingredients: [],
        preparation: {
            prePreparation: [],
            preparation: [],
            conservation: [],
        },
    }

    // Merge with defaults
    const mergedData = {...defaultRecipe, ...recipeData}

    // Map ingredients to ensure only desired fields are stored
    const mappedIngredients = mergedData.ingredients.map(mapToRecipeIngredient)

    // Extract only the fields that should be stored in the database
    const {
        name,
        category,
        allergens,
        productionTime,
        pvp,
        costPerServing,
        servingsPerProduction,
        productionCost,
        priceVariation,
        inMenu,
        preparation,
    } = mergedData

    // Return the mapped recipe with only the desired fields
    return {
        name,
        category,
        allergens,
        productionTime,
        pvp,
        costPerServing,
        servingsPerProduction,
        productionCost,
        priceVariation,
        inMenu,
        ingredients: mappedIngredients,
        preparation,
    }
}

export const createRecipe = onCallWithSecretKey(
    async (request: Request<CreateRecipeRequest>): Promise<CreateRecipeResponse> => {
        try {
            const recipeData = request.data.recipe

            // Map the input data to the database model
            const recipeToStore = mapToRecipeDBModel(recipeData)

            // Store in Firestore
            const recipeRef = await firestore.collection('recipes').add(recipeToStore)
            const recipe = await recipeRef.get()
            const newRecipe = recipe.data() as RecipeDBModel

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
