import { ChangeEvent, FC } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useFullRecipeIngredients } from '@/entities/recipe/model/recipeIngredientsHooks'
import { Allergen, Recipe } from '@tipi/shared'

import { AllergenSelector } from '../AllergenSelector'
import { CategorySelector } from './CategorySelector'
import { ImageUploader } from './ImageUploader'
import { IngredientsSection } from './IngredientsSection'
import { PreparationSteps } from './PreparationSteps'
import { ProductionTime } from './ProductionTime'
import { RecipeHeader } from './RecipeHeader'
import { RecipePricing } from './RecipePricing'

interface RecipeDetailsContentProps {
    recipe: Recipe
    updateRecipe: (id: string, data: Partial<Recipe>) => Promise<void>
    toggleRecipeMenuStatus: (id: string) => void
}

export const RecipeDetailsContent: FC<RecipeDetailsContentProps> = ({
    recipe,
    updateRecipe,
    toggleRecipeMenuStatus,
}) => {
    const fullRecipeIngredients = useFullRecipeIngredients(recipe.ingredients)

    const handleImageUploaded = async (imageUrl: string) => {
        await updateRecipe(recipe.id, { image: imageUrl })
    }

    const handleCategoryChange = async (category: string) => {
        await updateRecipe(recipe.id, { category })
    }

    const handleAllergensChange = async (allergens: Allergen[]) => {
        await updateRecipe(recipe.id, { allergens })
    }

    const handleProductionTimeChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const minutes = e.target.value
        await updateRecipe(recipe.id, { productionTime: `${minutes} min` })
    }

    const handleToggleRecipeMenuStatus = () => {
        toggleRecipeMenuStatus(recipe.id)
    }

    return (
        <div className='flex min-h-screen flex-col'>
            <div className='space-y-6 p-4'>
                {/* Header */}
                <RecipeHeader
                    recipeName={recipe.name}
                    inMenu={recipe.inMenu}
                    onToggleMenu={handleToggleRecipeMenuStatus}
                />

                {/* Initial Breakdown */}
                <Card className='border-border bg-card'>
                    <CardHeader>
                        <div className='flex items-start justify-between'>
                            <div className='flex flex-col space-y-1'>
                                <div className='flex items-center gap-3'>
                                    <h2 className='text-primary text-2xl font-bold'>{recipe.name}</h2>
                                </div>
                                <div>
                                    <CategorySelector
                                        category={recipe.category}
                                        onCategoryChange={handleCategoryChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <AllergenSelector selected={recipe.allergens} onChange={handleAllergensChange} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Pricing and Production Info */}
                        <RecipePricing
                            pvp={recipe.pvp}
                            costPerServing={recipe.costPerServing}
                            costPercentage={recipe.costPercentage}
                            servingsPerProduction={recipe.servingsPerProduction}
                            productionCost={recipe.productionCost}
                        />

                        {/* Production Time */}
                        <ProductionTime
                            productionTime={recipe.productionTime}
                            onProductionTimeChange={handleProductionTimeChange}
                        />
                    </CardContent>
                </Card>

                {/* Ingredients */}
                <IngredientsSection
                    ingredients={fullRecipeIngredients.ingredients}
                    isLoading={fullRecipeIngredients.isLoading}
                    servingsPerProduction={recipe.servingsPerProduction}
                />

                {/* Process */}
                <PreparationSteps preparation={recipe.preparation} />

                {/* Image */}
                <ImageUploader recipeId={recipe.id} image={recipe.image} onImageUploaded={handleImageUploaded} />
            </div>
        </div>
    )
}
