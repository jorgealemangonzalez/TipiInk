import { FC, useState, useEffect, useRef } from 'react'
import { ChevronLeft, BookOpen } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { RecipeDetails } from '@/entities/recipe/model/types'
import { useRecipes } from '@/entities/recipe/model/hooks'
import { AllergenIcon } from '@/shared/ui/allergen-icon'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BackButton } from '@/shared/ui/back-button'

const getPercentageColor = (percentage: number): string => {
  if (percentage < 20) return 'text-emerald-500'
  if (percentage <= 25) return 'text-green-400'
  if (percentage <= 30) return 'text-yellow-400'
  if (percentage <= 32) return 'text-orange-400'
  return 'text-red-500'
}

export const RecipeDetailsPage: FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getRecipeById, toggleRecipeMenuStatus } = useRecipes()
  const recipe = getRecipeById(Number(id))
  const [showPerServing, setShowPerServing] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const processContainerRef = useRef<HTMLDivElement>(null)

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary text-xl">Receta no encontrada</p>
      </div>
    )
  }

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    }

    const calculateProgress = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = stepsRef.current.findIndex(ref => ref === entry.target)
          if (index !== -1) {
            setActiveStep(index)
            const progress = (index * 33.33) + (entry.intersectionRatio * 33.33)
            setScrollProgress(Math.min(progress, 100))
          }
        }
      })
    }

    const observer = new IntersectionObserver(calculateProgress, options)

    stepsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      stepsRef.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="relative flex justify-center items-center">
          <BackButton className='absolute left-0'/>
          <h1 className="text-2xl font-bold text-primary">
            Receta
          </h1>
          <div 
            onClick={() => toggleRecipeMenuStatus(recipe.id)}
            className={cn(
              "p-2 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity absolute right-0",
              recipe.inMenu ? "bg-primary" : ""
            )}
          >
            <BookOpen className={cn(
              "h-7 w-7",
              recipe.inMenu ? "text-black" : "text-primary"
            )} />
          </div>
        </div>

        {/* Initial Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-primary">{recipe.name}</h2>
                </div>
                <p className="text-sm text-primary/80">{recipe.category}</p>
              </div>
              <div className="flex gap-2 items-center">
                {recipe.allergens.map((allergen, index) => (
                  <AllergenIcon key={index} allergen={allergen} />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Pricing and Production Info */}
            <div className="grid grid-cols-2 gap-4 text-primary">
              <div>
                <p className="text-sm text-primary/80">PVP</p>
                <p className="text-xl font-semibold">{recipe.price.toFixed(2)}€</p>
              </div>
              <div>
                <p className="text-sm text-primary/80">Coste por ración</p>
                <p className="text-xl font-semibold">
                  <span className={getPercentageColor(recipe.costPercentage)}>{recipe.costPerServing.toFixed(2)}€</span>
                  <span className="text-sm ml-2">
                    (<span className={getPercentageColor(recipe.costPercentage)}>{recipe.costPercentage}% Coste</span>)
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-primary/80">Raciones por producción</p>
                <p className="text-xl font-semibold">{recipe.servingsPerProduction}</p>
              </div>
              <div>
                <p className="text-sm text-primary/80">Coste por producción</p>
                <p className="text-xl font-semibold">{recipe.productionCost.toFixed(2)}€</p>
              </div>
            </div>
            
            {/* Production Time */}
            <div className="flex justify-between items-center border-t border-border mt-6 pt-4">
              <p className="text-sm text-primary/80">Tiempo de producción</p>
              <p className="text-xl font-semibold text-primary">{recipe.productionTime}</p>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Ingredientes</h2>
              <button
                onClick={() => setShowPerServing(!showPerServing)}
                className={cn(
                  "h-8 rounded-md transition-all duration-200",
                  "flex items-center gap-2",
                  "text-xs font-medium",
                  showPerServing 
                    ? "bg-primary text-primary-foreground px-3" 
                    : "bg-gray-800 text-primary px-3 hover:bg-gray-700"
                )}
              >
                {showPerServing ? "Por ración" : "Por producción"}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recipe.ingredients.map((ingredient, index) => {
                const cantidad = showPerServing
                  ? `${ingredient.quantityPerServing} ${ingredient.unit}`
                  : `${ingredient.quantity} ${ingredient.unit}`

                const precioTotal = showPerServing
                  ? (ingredient.totalPrice / recipe.servingsPerProduction).toFixed(2)
                  : ingredient.totalPrice.toFixed(2)

                return (
                  <div key={index} className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-primary">{ingredient.name}</h3>
                        <p className="text-sm text-primary/60">{ingredient.price.toFixed(2)}€/{ingredient.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-primary">{cantidad}</p>
                        <p className="text-sm font-semibold text-primary">{precioTotal}€</p>
                      </div>
                    </div>
                    {index < recipe.ingredients.length - 1 && (
                      <div className="h-px bg-border" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Process */}
        <Card className="bg-card border-border">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Proceso de elaboración</h2>
          </CardHeader>
          <CardContent>
            <div className="relative flex gap-1" ref={processContainerRef}>
              {/* Slider vertical */}
              <div className="sticky top-6 self-start">
                <div className="relative w-2 h-[600px] bg-gray-800 rounded-full">
                  <div 
                    className="absolute top-0 w-full rounded-full bg-primary transition-all duration-300 ease-out"
                    style={{
                      height: `${scrollProgress}%`
                    }}
                  />
                  {/* Puntos del slider */}
                  <div className="absolute inset-0 flex flex-col justify-between py-[10%]">
                    {[0, 1, 2].map((step) => (
                      <button
                        key={step}
                        onClick={() => {
                          stepsRef.current[step]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 -ml-2",
                          scrollProgress >= (step + 1) * 33.33 
                            ? "bg-gray-800 border-primary" 
                            : "bg-gray-800 border-gray-600",
                          "hover:border-primary/80"
                        )}
                      >
                        <div 
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            scrollProgress >= (step + 1) * 33.33 ? "bg-primary" : "bg-gray-600"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pasos del proceso */}
              <div className="flex-1 space-y-16 pl-20">
                {/* Preelaboración */}
                <div 
                  ref={el => stepsRef.current[0] = el}
                  className={cn(
                    "transition-all duration-300",
                    activeStep === 0 ? "opacity-100" : "opacity-50"
                  )}
                >
                  <h4 className="text-lg font-semibold text-primary mb-4">Preelaboración</h4>
                  <ul className="list-none space-y-3">
                    {recipe.preparation.prePreparation.map((step, index) => (
                      <li key={index} className="text-primary/80 flex items-start gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Elaboración */}
                <div 
                  ref={el => stepsRef.current[1] = el}
                  className={cn(
                    "transition-all duration-300",
                    activeStep === 1 ? "opacity-100" : "opacity-50"
                  )}
                >
                  <h4 className="text-lg font-semibold text-primary mb-4">Elaboración</h4>
                  <ul className="list-none space-y-3">
                    {recipe.preparation.preparation.map((step, index) => (
                      <li key={index} className="text-primary/80 flex items-start gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conservación */}
                <div 
                  ref={el => stepsRef.current[2] = el}
                  className={cn(
                    "transition-all duration-300",
                    activeStep === 2 ? "opacity-100" : "opacity-50"
                  )}
                >
                  <h4 className="text-lg font-semibold text-primary mb-4">Conservación</h4>
                  <ul className="list-none space-y-3">
                    {recipe.preparation.conservation.map((step, index) => (
                      <li key={index} className="text-primary/80 flex items-start gap-3">
                        <span className="text-primary mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <Card className="bg-card border-border">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Foto del plato</h2>
          </CardHeader>
          <CardContent>
            <img 
              src={recipe.image} 
              alt={recipe.name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 