import { FC, useState } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { FullRecipeIngredient } from '@tipi/shared'

interface IngredientsSectionProps {
    ingredients: FullRecipeIngredient[]
    servingsPerProduction: number
    isLoading: boolean
}

export const IngredientsSection: FC<IngredientsSectionProps> = ({ ingredients, servingsPerProduction, isLoading }) => {
    const [showPerServing, setShowPerServing] = useState(false)

    return (
        <Card className='border-border bg-card'>
            <CardHeader className='flex flex-col gap-6'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-primary text-2xl font-bold'>Ingredientes</h2>
                    {!isLoading && (
                        <button
                            onClick={() => setShowPerServing(!showPerServing)}
                            className={cn(
                                'h-8 rounded-md transition-all duration-200',
                                'flex items-center gap-2',
                                'text-xs font-medium',
                                showPerServing
                                    ? 'bg-primary text-primary-foreground px-3'
                                    : 'text-primary bg-gray-800 px-3 hover:bg-gray-700',
                            )}
                        >
                            {showPerServing ? 'Por ración' : 'Por producción'}
                        </button>
                    )}
                    {isLoading && <Skeleton className='h-8 w-32 rounded-md' />}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className='space-y-4'>
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className='flex flex-col space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex-1'>
                                        <Skeleton className='mb-2 h-6 w-40' />
                                        <Skeleton className='h-4 w-28' />
                                    </div>
                                    <div className='text-right'>
                                        <Skeleton className='mb-2 h-6 w-20' />
                                        <Skeleton className='h-4 w-16' />
                                    </div>
                                </div>
                                {index < 2 && <div className='bg-border h-px' />}
                            </div>
                        ))}
                    </div>
                ) : ingredients.length > 0 ? (
                    <div className='space-y-4'>
                        {ingredients.map((ingredient, index) => {
                            const cantidad = showPerServing
                                ? `${ingredient.quantityPerServing.toFixed(2)} ${ingredient.unit}`
                                : `${ingredient.quantityPerProduction} ${ingredient.unit}`

                            const precioTotal = showPerServing
                                ? (ingredient.pricePerProduction / servingsPerProduction).toFixed(2)
                                : ingredient.pricePerProduction?.toFixed(2)

                            return (
                                <div key={index} className='flex flex-col space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex-1'>
                                            <h3 className='text-primary text-lg font-medium'>{ingredient.name}</h3>
                                            <p className='text-primary/60 text-sm'>
                                                {ingredient.pricePerUnit.toFixed(2)}€/{ingredient.unit}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-primary text-lg font-medium'>{cantidad}</p>
                                            <p className='text-primary text-sm font-semibold'>{precioTotal}€</p>
                                        </div>
                                    </div>
                                    {index < ingredients.length - 1 && <div className='bg-border h-px' />}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className='text-primary/50 flex flex-col items-center justify-center py-8'>
                        <p>No hay ingredientes en esta receta</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
