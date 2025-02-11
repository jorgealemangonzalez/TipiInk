import { useState } from 'react'
import { mockRecipes as initialMockRecipes } from './mock'
import { RecipeDetails } from './types'

export const useRecipes = () => {
  const [recipes, setRecipes] = useState(initialMockRecipes)

  const getAllRecipes = () => recipes

  const getRecipeById = (id: number): RecipeDetails | undefined => 
    recipes.find(recipe => recipe.id === id)

  const getRecipesByCategory = (category: string): RecipeDetails[] =>
    recipes.filter(recipe => recipe.category === category)

  const getMenuRecipes = (): RecipeDetails[] =>
    recipes.filter(recipe => recipe.inMenu)

  const toggleRecipeMenuStatus = (id: number) => {
    setRecipes(currentRecipes => 
      currentRecipes.map(recipe => 
        recipe.id === id 
          ? { ...recipe, inMenu: !recipe.inMenu }
          : recipe
      )
    )
  }

  return {
    getAllRecipes,
    getRecipeById,
    getRecipesByCategory,
    getMenuRecipes,
    toggleRecipeMenuStatus
  }
} 