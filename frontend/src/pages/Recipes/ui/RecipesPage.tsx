import { Separator } from "@/components/ui/separator"
import { useRecipes } from '@/entities/recipe/model/recipeHooks'
import { BackButton } from '@/shared/ui/back-button'
import { BookOpen, Euro, TrendingDown, TrendingUp } from 'lucide-react'
import { FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      .filter(recipe => 
        (showOnlyMenu ? recipe.inMenu : true) &&
        (recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query)))
      )
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary text-xl">Cargando recetas...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-primary">Recetario</h1>
          <div 
            onClick={() => setShowOnlyMenu(!showOnlyMenu)}
            className={cn(
              "w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ml-auto",
              showOnlyMenu ? "bg-primary" : ""
            )}
          >
            <BookOpen className={cn(
              "h-7 w-7",
              showOnlyMenu ?"text-black" : "text-primary" 
            )} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="rounded-full pl-1 pr-7 flex items-center gap-3 h-[60px] border border-gray-700">
            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center border-r border-gray-700">
              <Euro className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className={cn("text-xl font-bold", getPercentageColor(totalAverageCost))}>
                {totalAverageCost}%
              </span>
            </div>
          </div>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="mt-4">
          {filteredRecipes.map((recipe, index) => (
            <div key={recipe.id}>
              <div
                onClick={() => handleRecipeClick(recipe.id)}
                className="py-4 px-2 flex items-center justify-between hover:bg-gray-700/30 transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-primary">{recipe.name}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {recipe.priceVariation > 0 ? (
                      <TrendingUp className="h-5 w-5 text-red-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-emerald-500" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      recipe.priceVariation > 0 ? "text-red-500" : "text-emerald-500"
                    )}>
                      {Math.abs(recipe.priceVariation)}%
                    </span>
                  </div>
                  <span className={cn("text-2xl font-bold", getPercentageColor(recipe.costPercentage))}>
                    {recipe.costPercentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              {index < filteredRecipes.length - 1 && (
                <Separator className="bg-gray-700/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 