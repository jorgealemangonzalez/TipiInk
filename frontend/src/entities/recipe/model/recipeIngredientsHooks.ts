import { useMemo } from 'react'

import { documentId, where as fWhere } from 'firebase/firestore'

import { useCollection } from '@/firebase/hooks/useCollection'
import {
    FullRecipeIngredient,
    Ingredient,
    RecipeIngredient,
    ingredientConverter,
    mergeFullRecipeIngredients,
} from '@tipi/shared'

interface UseFullRecipeIngredientsResponse {
    ingredients: FullRecipeIngredient[]
    isLoading: boolean
}

export const useFullRecipeIngredients = (ingredients: RecipeIngredient[]): UseFullRecipeIngredientsResponse => {
    const ingredientsParamsString = ingredients
        .map(ingredient => ingredient.id)
        .sort()
        .join(',')
    const whereClauses = useMemo<Parameters<typeof fWhere>[]>(() => {
        console.log('Ingredients changed', ingredients)
        return [[documentId(), 'in', ingredients.map(ingredient => ingredient.id)]]
    }, [ingredientsParamsString])

    const { results, isLoading } = useCollection<Ingredient>({
        path: 'organizations/demo/ingredients',
        where: whereClauses,
        converter: ingredientConverter,
    })

    const fullRecipeIngredients = useMemo(() => {
        if (isLoading) {
            return []
        }
        return mergeFullRecipeIngredients(ingredients, results)
    }, [results, ingredientsParamsString])

    // Log all
    console.log('--------------------------------')
    console.log('Full recipe ingredients', fullRecipeIngredients)
    console.log('Ingredients', ingredients)
    console.log('Results', results)
    console.log('Where clauses', whereClauses)
    console.log('Is loading', isLoading)
    console.log('--------------------------------')

    return {
        ingredients: fullRecipeIngredients,
        isLoading,
    }
}
