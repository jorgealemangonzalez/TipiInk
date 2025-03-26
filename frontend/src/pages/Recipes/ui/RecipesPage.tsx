import { FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { BookOpen, Euro, TrendingDown, TrendingUp } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { useRecipes } from '@/entities/recipe/model/recipeHooks'
import { BackButton } from '@/shared/ui/back-button'

import { cn } from '../../../lib/utils'
import { SearchBar } from './SearchBar'

const getPercentageColor = (percentage: number): string => {
    if (percentage < 20) return 'text-emerald-500'
    if (percentage <= 25) return 'text-green-400'
    if (percentage <= 30) return 'text-yellow-400'
    if (percentage <= 32) return 'text-orange-400'
    return 'text-red-500'
}

export const RecipesPage: FC = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [showOnlyMenu, setShowOnlyMenu] = useState(false)
    const { getAllRecipes, isLoading } = useRecipes()
    const recipes = getAllRecipes()

    const filteredRecipes = useMemo(() => {
        const query = searchQuery.toLowerCase()
        return recipes
            .filter(recipe => (showOnlyMenu ? recipe.inMenu : true) && recipe.name.toLowerCase().includes(query))
            .sort((a, b) => b.costPercentage - a.costPercentage)
    }, [searchQuery, recipes, showOnlyMenu])

    const totalAverageCost = useMemo(() => {
        const recipesWithCost = filteredRecipes.filter(recipe => recipe.costPercentage > 0)
        if (recipesWithCost.length === 0) return 0
        const total = recipesWithCost.reduce((acc, recipe) => acc + recipe.costPercentage, 0)
        return Math.round(total / recipesWithCost.length)
    }, [filteredRecipes])

    const handleRecipeClick = (recipeId: string) => {
        navigate(`/recipes/${recipeId}`)
    }

    if (isLoading) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <p className='text-primary text-xl'>Cargando recetas...</p>
            </div>
        )
    }

    return (
        <div className='flex min-h-screen flex-col'>
            <div className='space-y-4 p-4'>
                <div className='flex items-center gap-4'>
                    <BackButton />
                    <h1 className='text-primary absolute left-1/2 -translate-x-1/2 text-2xl font-bold'>Recetario</h1>
                    <div
                        onClick={() => setShowOnlyMenu(!showOnlyMenu)}
                        className={cn(
                            'ml-auto flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-80',
                            showOnlyMenu ? 'bg-primary' : '',
                        )}
                    >
                        <BookOpen className={cn('h-7 w-7', showOnlyMenu ? 'text-black' : 'text-primary')} />
                    </div>
                </div>

                <div className='flex items-center justify-between'>
                    <div className='flex h-[60px] items-center gap-3 rounded-full border border-gray-700 pl-1 pr-7'>
                        <div className='flex h-[44px] w-[44px] items-center justify-center rounded-full border-r border-gray-700'>
                            <Euro className='text-primary h-6 w-6' />
                        </div>
                        <div className='flex flex-col'>
                            <span className={cn('text-xl font-bold', getPercentageColor(totalAverageCost))}>
                                {totalAverageCost}%
                            </span>
                        </div>
                    </div>
                    <SearchBar onSearch={setSearchQuery} />
                </div>

                <div className='mt-4'>
                    {filteredRecipes.map((recipe, index) => (
                        <div key={recipe.id}>
                            <div
                                onClick={() => handleRecipeClick(recipe.id)}
                                className='flex cursor-pointer items-center justify-between px-2 py-4 transition-colors hover:bg-gray-700/30'
                            >
                                <h3 className='text-primary text-xl font-semibold'>{recipe.name}</h3>
                                <div className='flex items-center gap-3'>
                                    <div className='flex items-center gap-1'>
                                        {recipe.priceVariation > 0 ? (
                                            <TrendingUp className='h-5 w-5 text-red-500' />
                                        ) : (
                                            <TrendingDown className='h-5 w-5 text-emerald-500' />
                                        )}
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                recipe.priceVariation > 0 ? 'text-red-500' : 'text-emerald-500',
                                            )}
                                        >
                                            {Math.abs(recipe.priceVariation)}%
                                        </span>
                                    </div>
                                    <span
                                        className={cn('text-2xl font-bold', getPercentageColor(recipe.costPercentage))}
                                    >
                                        {recipe.costPercentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                            {index < filteredRecipes.length - 1 && <Separator className='bg-gray-700/50' />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
