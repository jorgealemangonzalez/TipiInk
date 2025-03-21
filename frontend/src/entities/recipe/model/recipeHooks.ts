import { Recipe, RecipeDBModel } from '@monorepo/functions/src/types/recipe'
import { FirestoreDataConverter } from 'firebase/firestore'
import { useEffect } from 'react'
import { useCollection } from '../../../firebase/hooks/useCollection'
import { getCostPercentage, getCostPerServing, getPricePerProduction, getQuantityPerServing, getProductionCost } from './recipeModelServices'
import { mockRecipes } from './recipesMock'

const recipeConverter: FirestoreDataConverter<Recipe, RecipeDBModel> = { // TODO MOVE TO BACKEND AND IMPORT FROM @MONOREPO/FUNCTIONS
  toFirestore: (recipe: Recipe) => {
    console.log('toFirestore', recipe)
    const {
      id,
      costPercentage,
      costPerServing,
      ingredients,
      ...recipeData 
    } = recipe
    return {
      ...recipeData,
      ingredients: ingredients.map((ingredient) => {
        const {
          pricePerProduction,
          quantityPerServing,
          ...ingredientData
        } = ingredient
        return ingredientData
      }),
    }
  },
  fromFirestore: (snapshot, options) => {
    console.log('fromFirestore', snapshot)
    const recipe = snapshot.data(options) as RecipeDBModel
    const productionCost = getProductionCost(recipe)
    const costPerServing = getCostPerServing(recipe, productionCost)
    const costPercentage = getCostPercentage(recipe, costPerServing)
    return {
      ...recipe,
      id: snapshot.id,
      costPercentage,
      costPerServing,
      productionCost,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        pricePerProduction: getPricePerProduction(ingredient),
        quantityPerServing: getQuantityPerServing(recipe, ingredient),
      })),
    } as Recipe
  },
}

export const useRecipes = () => {
  const {
    results: recipes,
    isLoading,
    addDocument,
    updateDocument,
    removeDocument
  } = useCollection<Recipe>({
    path: 'recipes',
    limit: 100,
    converter: recipeConverter
  })
  console.log('recipes', recipes)

  // Initialize the database with mock recipes if none exist
  useEffect(() => {
    const initializeRecipes = async () => {
      if (!isLoading && recipes.length === 0) {
        console.log('No recipes found, initializing with mock data')
        
        // Add mock recipes to the database
        for (const recipe of mockRecipes) {
          await addDocument(recipe)
        }
      }
    }

    initializeRecipes()
  }, [isLoading, recipes.length, addDocument])

  const getAllRecipes = () => recipes

  const getRecipeById = (id: string): Recipe | undefined => 
    recipes.find(recipe => recipe.id === id)

  const getRecipesByCategory = (category: string): Recipe[] =>
    recipes.filter(recipe => recipe.category === category)

  const getMenuRecipes = (): Recipe[] =>
    recipes.filter(recipe => recipe.inMenu)

  const toggleRecipeMenuStatus = (id: string) => {
    const recipe = recipes.find(r => r.id === id)
    if (recipe) {
      updateDocument(id, { inMenu: !recipe.inMenu })
    }
  }

  return {
    getAllRecipes,
    getRecipeById,
    getRecipesByCategory,
    getMenuRecipes,
    toggleRecipeMenuStatus,
    isLoading,
    addRecipe: addDocument,
    updateRecipe: updateDocument,
    removeRecipe: removeDocument
  }
} 