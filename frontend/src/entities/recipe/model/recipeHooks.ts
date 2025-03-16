import { useEffect } from 'react'
import { mockRecipes } from './recipesMock'
import { useCollection } from '../../../firebase/hooks/useCollection'
import { Recipe, RecipeDBModel } from '@monorepo/functions/src/types/recipe'
import { FirestoreDataConverter, WithFieldValue } from 'firebase/firestore'
import { getCostPercentage } from './recipeModelServices'

const recipeConverter: FirestoreDataConverter<Recipe, RecipeDBModel> = {
  toFirestore: (recipe: WithFieldValue<Recipe>) => {
    console.log('toFirestore', recipe)
    const { costPercentage, ...recipeData } = recipe
    return recipeData
  },
  fromFirestore: (snapshot, options) => {
    console.log('fromFirestore', snapshot)
    const data = snapshot.data(options) as RecipeDBModel
    return {
      ...data,
      id: snapshot.id,
      costPercentage: getCostPercentage(data)
    } as Recipe
  }
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
    orderBy: ['updatedAt', 'desc'],
    limit: 100,
    converter: recipeConverter
  })

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