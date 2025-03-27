import { FC } from 'react'
import { useParams } from 'react-router-dom'

import { useRecipes } from '@/entities/recipe/model/recipeHooks'

import { LoadingState } from './components/LoadingState'
import { NotFoundState } from './components/NotFoundState'
import { RecipeDetailsContent } from './components/RecipeDetailsContent'

export const RecipeDetailsPage: FC = () => {
    const { id } = useParams()
    const { getRecipeById, toggleRecipeMenuStatus, updateRecipe, isLoading } = useRecipes()
    const recipe = id ? getRecipeById(id) : undefined

    if (isLoading) {
        return <LoadingState />
    }

    if (!recipe) {
        return <NotFoundState />
    }

    return (
        <RecipeDetailsContent
            recipe={recipe}
            updateRecipe={updateRecipe}
            toggleRecipeMenuStatus={toggleRecipeMenuStatus}
        />
    )
}
