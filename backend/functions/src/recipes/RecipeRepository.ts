import { Timestamp } from 'firebase-admin/firestore'

import { getIngredientsByIds } from '@/ingredients/IngredientsRepository'
import {
    EntityUpdate,
    Recipe,
    RecipeDBModel,
    RecipeIngredient,
    RecipeWithIngredients,
    defaultRecipeData,
    recipeConverter,
} from '@tipi/shared'

import { firestore } from '../FirebaseInit'

export const getRecipesRef = () =>
    firestore.collection('organizations/demo/recipes').withConverter<Recipe, RecipeDBModel>(recipeConverter)

export const getRecipeRefById = (id: string) => getRecipesRef().doc(id)

export const getRecipeById = async (id: string): Promise<Recipe> => {
    const recipe = (await getRecipeRefById(id).get()).data()
    if (!recipe) {
        throw new Error(`Recipe not found id: ${id}`)
    }
    return recipe as Recipe
}

export const getRecipeWithIngredientsById = async (id: string): Promise<RecipeWithIngredients> => {
    const recipe = (await getRecipeRefById(id).get()).data()

    if (!recipe) {
        throw new Error(`Recipe not found id: ${id}`)
    }

    const ingredients = await getIngredientsByIds(
        recipe.ingredients.map((ingredient: RecipeIngredient) => ingredient.id),
    )

    const recipeWithIngredients: RecipeWithIngredients = {
        ...recipe,
        ingredients,
    }

    return recipeWithIngredients
}

export const createRecipe = async (recipeData: EntityUpdate<RecipeDBModel>): Promise<Recipe> => {
    const recipeRef = await getRecipesRef().add({
        ...defaultRecipeData,
        ...recipeData,
        preparation: {
            ...defaultRecipeData.preparation,
            ...recipeData.preparation,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    })

    const recipe = await recipeRef.get()
    return recipe.data() as Recipe
}

export const updateRecipe = async (id: string, recipeData: EntityUpdate<RecipeDBModel>): Promise<Recipe> => {
    const recipeRef = getRecipeRefById(id)

    await recipeRef.update({
        ...recipeData,
        updatedAt: Timestamp.now(),
    })

    const updatedRecipe = await recipeRef.get()
    return updatedRecipe.data() as Recipe
}
