import { Timestamp } from 'firebase-admin/firestore'

import {
    EntityUpdate,
    Recipe,
    RecipeDBModel,
    RecipeIngredient,
    RecipeWithIngredients,
    defaultRecipeData,
    defaultRecipeIngredient,
    mergeFullRecipeIngredients,
    recipeConverter,
} from '@tipi/shared'

import { firestore } from '../FirebaseInit'
import { getIngredientsByIds } from '../ingredients/IngredientsRepository'

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
        ingredients: mergeFullRecipeIngredients(recipe.ingredients, ingredients),
        id,
    }

    return recipeWithIngredients
}

export const createRecipe = async (recipeData: EntityUpdate<RecipeDBModel>): Promise<Recipe> => {
    const newRecipeDetails = {
        ...recipeData,
        ingredients:
            recipeData.ingredients?.map(ingredient => ({
                ...defaultRecipeIngredient,
                ...ingredient,
                quantityPerServing: 0, // REMOVED BY THE CONVERTER
            })) ?? [],
    }
    const recipeRef = await getRecipesRef().add({
        id: 'new', // REMOVED BY THE CONVERTER
        costPercentage: 0, // REMOVED BY THE CONVERTER
        costPerServing: 0, // REMOVED BY THE CONVERTER
        ...defaultRecipeData,
        ...newRecipeDetails,
        preparation: {
            ...defaultRecipeData.preparation,
            ...newRecipeDetails.preparation,
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
