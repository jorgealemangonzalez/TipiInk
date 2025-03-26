import { useDocument } from '@/firebase/hooks/useDocument'
import { Ingredient, ingredientConverter } from '@tipi/shared'

export const useIngredient = (id: string) => {
    const { document, isLoading } = useDocument<Ingredient>({
        collectionName: 'organizations/demo/ingredients',
        id,
        converter: ingredientConverter,
    })

    return {
        ingredient: document,
        isLoading,
    }
}
