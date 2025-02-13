import { FC, useState, useMemo } from 'react'
import { ChevronLeft, Euro, TrendingUp, TrendingDown, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { cn } from '../../../lib/utils'
import { useRecipes } from '@/entities/recipe/model/hooks'
import { Separator } from "@/components/ui/separator"
import { BackButton } from '@/shared/ui/back-button'
import { LocationSelector } from '@/shared/ui/location-selector'
import { Location } from '@/entities/recipe/model/types'

const getCostColor = (cost: number): string => {
  if (cost < 2) return 'text-emerald-500'
  if (cost <= 3) return 'text-green-400'
  if (cost <= 4) return 'text-yellow-400'
  if (cost <= 5) return 'text-orange-400'
  return 'text-red-500'
}

export const RecipeReviewPage: FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyMenu, setShowOnlyMenu] = useState(false)
  const [location, setLocation] = useState<Location>('ibiza')
  const { getAllRecipes } = useRecipes()
  const recipes = getAllRecipes()

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return recipes
      .filter(recipe => 
        (showOnlyMenu ? recipe.inMenu : true) &&
        (recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query)))
      )
      .sort((a, b) => b.costs[location].costPerServing - a.costs[location].costPerServing)
  }, [searchQuery, recipes, showOnlyMenu, location])

  const averageCost = useMemo(() => {
    if (filteredRecipes.length === 0) return 0
    const total = filteredRecipes.reduce((acc, recipe) => acc + recipe.costs[location].costPerServing, 0)
    return Number((total / filteredRecipes.length).toFixed(2))
  }, [filteredRecipes, location])

  const handleRecipeClick = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-primary">Recetario</h1>
          <div className="ml-auto flex items-center gap-4">
            <LocationSelector value={location} onChange={setLocation} />
            {/* <div 
              onClick={() => setShowOnlyMenu(!showOnlyMenu)}
              className={cn(
                "w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity",
                showOnlyMenu ? "bg-primary" : ""
              )}
            >
              <BookOpen className={cn(
                "h-7 w-7",
                showOnlyMenu ? "text-primary-foreground" : "text-primary"
              )} />
            </div> */}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="rounded-full pl-1 pr-7 flex items-center gap-3 h-[60px] border border-gray-700">
            <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center border-r border-gray-700">
              <Euro className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className={cn("text-xl font-bold", getCostColor(averageCost))}>
                {averageCost}€
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
                      {Math.abs(recipe.priceVariation).toFixed(2)}€
                    </span>
                  </div>
                  <span className={cn("text-2xl font-bold", getCostColor(recipe.costs[location].costPerServing))}>
                    {recipe.costs[location].costPerServing.toFixed(2)}€
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