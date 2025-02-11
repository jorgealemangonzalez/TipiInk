import { FC, useState, useMemo } from 'react'
import { ChevronLeft, Euro, TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { cn } from '../../../lib/utils'

const getPercentageColor = (percentage: number): string => {
  if (percentage < 20) return 'text-emerald-500'
  if (percentage <= 25) return 'text-green-400'
  if (percentage <= 30) return 'text-yellow-400'
  if (percentage <= 32) return 'text-orange-400'
  return 'text-red-500'
}

// Mock data - This should come from your data layer later
const mockRecipes = [
  { 
    id: 1, 
    name: 'Paella Valenciana', 
    costPercentage: 32,
    priceVariation: 2.5,
    ingredients: ['arroz', 'azafrán', 'pollo', 'conejo', 'judías verdes']
  },
  { 
    id: 2, 
    name: 'Gazpacho', 
    costPercentage: 25,
    priceVariation: -1.2,
    ingredients: ['tomate', 'pepino', 'pimiento', 'ajo', 'aceite de oliva']
  },
  { 
    id: 3, 
    name: 'Tortilla Española', 
    costPercentage: 28,
    priceVariation: 0.8,
    ingredients: ['patata', 'huevo', 'cebolla', 'aceite de oliva']
  },
  { 
    id: 4, 
    name: 'Patatas Bravas', 
    costPercentage: 18,
    priceVariation: -0.5,
    ingredients: ['patata', 'salsa brava', 'alioli']
  },
]

export const RecipeReviewPage: FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return mockRecipes
      .filter(recipe => 
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
      )
      .sort((a, b) => b.costPercentage - a.costPercentage)
  }, [searchQuery])

  const totalAverageCost = Math.round(
    mockRecipes.reduce((acc, recipe) => acc + recipe.costPercentage, 0) / mockRecipes.length
  )

  const handleRecipeClick = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate(-1)}
            className="w-[60px] h-[60px] rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="h-7 w-7 text-primary" />
          </div>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-primary">Recetario</h1>
        </div>

        <div className="flex items-center justify-between">
          <div className="rounded-full pl-1 pr-7 flex items-center gap-3 h-[60px] bg-gray-700">
            <div className="w-[44px] h-[44px] rounded-full bg-dark-card-bg flex items-center justify-center">
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

        <div className="space-y-4 mt-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.id)}
              className="bg-gray-700 rounded-full pl-6 pr-7 flex items-center justify-between h-[69px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity cursor-pointer"
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
                  {recipe.costPercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 