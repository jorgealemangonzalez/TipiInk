import { useEffect } from 'react'
import { mockRecipes } from './mock'
import { RecipeDetails } from './types'
import { useCollection } from '../../../firebase/hooks/useCollection'

export const useRecipes = () => {
  const {
    results: recipes,
    isLoading,
    addDocument,
    updateDocument,
    removeDocument
  } = useCollection<RecipeDetails>({
    path: 'recipes',
    orderBy: ['updatedAt', 'desc'],
    limit: 100
  })

  // Initialize the database with mock recipes if none exist
  useEffect(() => {
    const initializeRecipes = async () => {
      if (!isLoading && recipes.length === 0) {
        console.log('No recipes found, initializing with mock data')
        
        // Add mock recipes to the database
        for (const recipe of mockRecipes) {
          const { id, ...recipeData } = recipe
          await addDocument(recipeData)
        }
      }
    }

    initializeRecipes()
  }, [isLoading, recipes.length, addDocument])

  const getAllRecipes = () => recipes

  const getRecipeById = (id: string): RecipeDetails | undefined => 
    recipes.find(recipe => recipe.id === id)

  const getRecipesByCategory = (category: string): RecipeDetails[] =>
    recipes.filter(recipe => recipe.category === category)

  const getMenuRecipes = (): RecipeDetails[] =>
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