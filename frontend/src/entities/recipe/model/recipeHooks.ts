import { useEffect } from 'react'

import { Recipe, recipeConverter } from '@tipi/shared'

import { useCollection } from '../../../firebase/hooks/useCollection'
import { mockRecipes } from './recipesMock'

export const useRecipes = () => {
    const {
        results: recipes,
        isLoading,
        addDocument,
        updateDocument,
        removeDocument,
    } = useCollection<Recipe>({
        path: 'organizations/demo/recipes',
        limit: 1000,
        converter: recipeConverter,
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

    const getRecipeById = (id: string): Recipe | undefined => recipes.find(recipe => recipe.id === id)

    const getRecipesByCategory = (category: string): Recipe[] => recipes.filter(recipe => recipe.category === category)

    const getMenuRecipes = (): Recipe[] => recipes.filter(recipe => recipe.inMenu)

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
        removeRecipe: removeDocument,
    }
}
