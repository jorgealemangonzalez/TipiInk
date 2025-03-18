import { useAuth } from '@/auth/auth'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useRecipes } from '@/entities/recipe/model/recipeHooks'
import { uploadFileToStorage } from '@/firebase/fileStorage'
import { cn } from '@/shared/lib/utils'
import { AllergenIcon } from '@/shared/ui/allergen-icon'
import { BackButton } from '@/shared/ui/back-button'
import { BookOpen, Loader2, Upload, Clock, Info } from 'lucide-react'
import { ChangeEvent, FC, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Recipe categories available
const RECIPE_CATEGORIES = [
  'Arroces',
  'Pescados',
  'Pasta',
  'Carnes',
  'Postres',
  'Asiático',
  'Otros'
]

const getPercentageColor = (percentage: number): string => {
  if (percentage < 20) return 'text-emerald-500'
  if (percentage <= 25) return 'text-green-400'
  if (percentage <= 30) return 'text-yellow-400'
  if (percentage <= 32) return 'text-orange-400'
  return 'text-red-500'
}

export const RecipeDetailsPage: FC = () => {
  const { id } = useParams()
  const { getRecipeById, toggleRecipeMenuStatus, updateRecipe, isLoading } = useRecipes()
  const recipe = id ? getRecipeById(id) : undefined
  const [showPerServing, setShowPerServing] = useState(false)
  const processContainerRef = useRef<HTMLDivElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditingTime, setIsEditingTime] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary text-xl">Cargando receta...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary text-xl">Receta no encontrada</p>
      </div>
    )
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!recipe || !event.target.files || !event.target.files[0]) return
    
    try {
      setIsUploading(true)
      setUploadProgress(0)
      const file = event.target.files[0]
      const fileName = `${Date.now()}`
      const filePath = `recipes/${recipe.id}/${fileName}`
      
      // Upload file and get download URL
      const imageUrl = await uploadFileToStorage(filePath, file, (totalUploaded) => {
        const percentage = Math.round((totalUploaded / file.size) * 100)
        setUploadProgress(percentage)
        console.log(`Upload progress: ${totalUploaded} bytes (${percentage}%)`)
      })
      
      // Update recipe with new image URL
      await updateRecipe(recipe.id, { image: imageUrl })
      
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCategoryChange = async (category: string) => {
    if (!recipe) return
    await updateRecipe(recipe.id, { category })
  }

  const handleProductionTimeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!recipe) return
    const minutes = e.target.value
    if (minutes) {
      await updateRecipe(recipe.id, { productionTime: `${minutes} min` })
    }
  }

  const extractMinutes = (timeString?: string): string => {
    if (!timeString) return ''
    const match = timeString.match(/(\d+)/)
    return match ? match[1] : ''
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

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
                <div>
                  <Select
                    defaultValue={recipe.category || undefined}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-40 h-6 text-sm py-0 px-0 border-0 bg-transparent focus:ring-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0">
                      <SelectValue placeholder="Seleccionar categoría" className="text-primary/50 italic" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECIPE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {recipe.allergens.length > 0 ? (
                  recipe.allergens.map((allergen, index) => (
                    <AllergenIcon key={index} allergen={allergen} />
                  ))
                ) : (
                  <p className="text-xs text-primary/50 italic">Sin alérgenos</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Pricing and Production Info */}
            <div className="grid grid-cols-2 gap-4 text-primary">
              <div>
                <p className="text-sm text-primary/80">PVP</p>
                <p className="text-xl font-semibold">{recipe.pvp.toFixed(2)}€</p>
              </div>
              <div>
                <p className="text-sm text-primary/80 flex items-center gap-1">
                  Coste por ración
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-primary/60 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        align="center" 
                        className="bg-gray-900 border-gray-800 text-primary"
                      >
                        <p className="max-w-60 text-xs">Suma de los costes de ingredientes</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
                <p className="text-xl font-semibold">
                  <span className={getPercentageColor(recipe.costPercentage)}>{recipe.costPerServing.toFixed(2)}€</span>
                  <span className="text-sm ml-2">
                    (<span className={getPercentageColor(recipe.costPercentage)}>{recipe.costPercentage.toFixed(0)}% Coste</span>)
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
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="w-16 h-8 bg-transparent border-none text-xl font-semibold text-primary text-right focus:outline-none" 
                  value={extractMinutes(recipe.productionTime)}
                  onChange={handleProductionTimeChange}
                  placeholder="0"
                />
                <span className="text-xl text-primary font-semibold">min</span>
              </div>
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
            {recipe.ingredients.length > 0 ? (
              <div className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => {
                  const cantidad = showPerServing
                    ? `${ingredient.quantityPerServing} ${ingredient.unit}`
                    : `${ingredient.quantityPerProduction} ${ingredient.unit}`

                  const precioTotal = showPerServing
                    ? (ingredient.pricePerProduction / recipe.servingsPerProduction).toFixed(2)
                    : ingredient.pricePerProduction.toFixed(2)

                  return (
                    <div key={index} className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-primary">{ingredient.name}</h3>
                          <p className="text-sm text-primary/60">{ingredient.pricePerUnit.toFixed(2)}€/{ingredient.unit}</p>
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
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-primary/50">
                <p>No hay ingredientes en esta receta</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Process */}
        <Card className="bg-card border-border">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Proceso de elaboración</h2>
          </CardHeader>
          <CardContent>
            <div className="relative flex gap-1" ref={processContainerRef}>
              {/* Pasos del proceso */}
              <div className="flex-1 space-y-16">
                {/* Preelaboración */}
                {recipe.preparation.prePreparation.length > 0 && (
                  <div className="transition-all duration-300">
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
                )}

                {/* Elaboración */}
                {recipe.preparation.preparation.length > 0 && (
                  <div className="transition-all duration-300">
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
                )}

                {/* Conservación */}
                {recipe.preparation.conservation.length > 0 && (
                  <div className="transition-all duration-300">
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
                )}

                {/* No process steps message */}
                {recipe.preparation.prePreparation.length === 0 && 
                 recipe.preparation.preparation.length === 0 && 
                 recipe.preparation.conservation.length === 0 && (
                  <div className="py-8 flex flex-col items-center justify-center text-primary/50">
                    <p>No hay pasos de elaboración definidos</p>
                  </div>
                )}
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
            {recipe.image ? (
              <div className="relative group">
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className={cn(
                    "w-full h-80 object-cover rounded-lg transition-all duration-150",
                    isUploading && "opacity-60"
                  )}
                />
                {/* Hover overlay with upload button */}
                <div 
                  onClick={triggerFileInput} 
                  className={cn(
                    "absolute inset-0 rounded-lg flex flex-col items-center justify-center active:scale-95 transition-all duration-150 cursor-pointer",
                    isUploading ? "bg-black/50" : "opacity-0 group-hover:opacity-100 bg-black/30"
                  )}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <Loader2 className="size-20 text-white animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{uploadProgress}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Upload className="h-12 w-12 text-white" />
                  )}
                </div>
              </div>
            ) : (
              <div 
                onClick={triggerFileInput} 
                className="w-full h-80 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-primary/30 rounded-lg bg-black/5 active:scale-[0.98] active:border-primary/60 active:bg-black/10 transition-all duration-150 cursor-pointer"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 text-primary/60 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-primary/90 text-xs font-medium">{uploadProgress}%</span>
                      </div>
                    </div>
                    <p className="text-primary/70">Subiendo imagen... ({uploadProgress}%)</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-primary/60" />
                    <p className="text-primary/70 text-center max-w-sm">Sube una foto del plato terminado.</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 