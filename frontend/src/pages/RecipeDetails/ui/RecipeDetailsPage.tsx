import { FC, useState, useEffect, useRef } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { RecipeDetails } from '@/entities/recipe/model/types'
import { AllergenIcon } from '@/shared/ui/allergen-icon'
import { cn } from '@/shared/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data - This should come from your data layer later
const mockRecipeDetails: RecipeDetails = {
  id: 1,
  name: 'Paella Valenciana',
  category: 'Arroces',
  allergens: ['crustaceans', 'fish', 'molluscs'],
  productionTime: '45 min',
  price: 18.50,
  costPerServing: 4.85,
  servingsPerProduction: 4,
  productionCost: 19.40,
  costPercentage: 32,
  priceVariation: 2.5,
  ingredients: [
    {
      name: 'Arroz bomba',
      quantity: 400,
      unit: 'g',
      quantityPerServing: 100,
      price: 4.50,
      totalPrice: 1.80
    },
    {
      name: 'Azafrán',
      quantity: 2,
      unit: 'g',
      quantityPerServing: 0.5,
      price: 3000,
      totalPrice: 6.00
    },
    // Add more ingredients...
  ],
  preparation: {
    prePreparation: [
      'Limpiar y cortar las verduras en trozos uniformes para una cocción homogénea',
      'Preparar el caldo de pescado con espinas y cabezas de pescado fresco',
      'Pelar y picar finamente el ajo y la cebolla',
      'Limpiar los mariscos y pescados, eliminando cualquier resto de arena',
      'Hidratar el azafrán en agua caliente durante 10 minutos',
      'Preparar todos los ingredientes medidos y organizados (mise en place)'
    ],
    preparation: [
      'Calentar el aceite de oliva en la paella a fuego medio-alto',
      'Sofreír el ajo y la cebolla hasta que estén transparentes',
      'Añadir las verduras y cocinar hasta que estén tiernas',
      'Incorporar el arroz y tostar ligeramente durante 2 minutos',
      'Agregar el azafrán hidratado y remover para distribuir el color',
      'Verter el caldo caliente y distribuir todos los ingredientes',
      'Cocinar a fuego fuerte durante 10 minutos',
      'Reducir el fuego y cocinar 8 minutos más',
      'Dejar reposar tapado con papel de aluminio 5 minutos',
      'Comprobar el punto de cocción y el socarrat'
    ],
    conservation: [
      'Mantener en recipiente hermético para preservar la humedad',
      'Conservar en frío entre 0-4°C para garantizar la seguridad alimentaria',
      'Consumir preferentemente en las siguientes 24h para óptima calidad',
      'No recalentar más de una vez para mantener la textura',
      'Evitar congelar para no alterar la textura del arroz'
    ]
  },
  image: '/210820-casa-elias-02.jpg'
}

export const RecipeDetailsPage: FC = () => {
  const navigate = useNavigate()
  const recipe = mockRecipeDetails
  const [showPerServing, setShowPerServing] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const processContainerRef = useRef<HTMLDivElement>(null)

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
        <div className="relative flex items-center">
          <div 
            onClick={() => navigate(-1)}
            className="w-[60px] h-[60px] rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary ml-8">
            Detalles de la receta
          </h1>
        </div>

        {/* Initial Breakdown */}
        <div className="bg-gray-700 rounded-3xl p-6">
          <div className="flex flex-col space-y-6">
            {/* Title and Category */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col space-y-1">
                <h2 className="text-2xl font-bold text-primary">{recipe.name}</h2>
                <p className="text-sm text-primary/80">{recipe.category}</p>
              </div>
              <div className="flex gap-2 items-center">
                {recipe.allergens.map((allergen, index) => (
                  <AllergenIcon key={index} allergen={allergen} />
                ))}
              </div>
            </div>
            
            {/* Pricing and Production Info */}
            <div className="grid grid-cols-2 gap-4 text-primary">
              <div>
                <p className="text-sm text-primary/80">PVP</p>
                <p className="text-xl font-semibold">{recipe.price.toFixed(2)}€</p>
              </div>
              <div>
                <p className="text-sm text-primary/80">Coste por ración</p>
                <p className="text-xl font-semibold">{recipe.costPerServing.toFixed(2)}€ <span className="text-sm">({recipe.costPercentage}% Coste)</span></p>
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
            <div className="flex justify-between items-center border-t border-primary/20 pt-4">
              <p className="text-sm text-primary/80">Tiempo de producción</p>
              <p className="text-xl font-semibold text-primary">{recipe.productionTime}</p>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-gray-700 rounded-3xl p-4 space-y-4">
          {/* Encabezado con título e interruptor */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary">Ingredientes</h3>
            <div className="flex rounded-full bg-gray-800 p-1">
              <button
                onClick={() => setShowPerServing(false)}
                className={cn(
                  "px-4 py-1 rounded-full text-sm transition-colors",
                  !showPerServing
                    ? "bg-primary text-primary-foreground"
                    : "text-primary/80 hover:text-primary"
                )}
              >
                Por producción
              </button>
              <button
                onClick={() => setShowPerServing(true)}
                className={cn(
                  "px-4 py-1 rounded-full text-sm transition-colors",
                  showPerServing
                    ? "bg-primary text-primary-foreground"
                    : "text-primary/80 hover:text-primary"
                )}
              >
                Por ración
              </button>
            </div>
          </div>

          {/* Tabla de ingredientes */}
          <div className="rounded-md border border-gray-600">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-600">
                  <TableHead className="text-primary/80 border-r border-gray-600">Ingrediente</TableHead>
                  <TableHead className="text-primary/80 border-r border-gray-600">Cantidad</TableHead>
                  <TableHead className="text-primary/80 border-r border-gray-600">Precio/Unidad</TableHead>
                  <TableHead className="text-primary/80">Precio Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipe.ingredients.map((ingredient, index) => {
                  const cantidad = showPerServing
                    ? `${ingredient.quantityPerServing} ${ingredient.unit}`
                    : `${ingredient.quantity} ${ingredient.unit}`

                  const precioTotal = showPerServing
                    ? (ingredient.totalPrice / recipe.servingsPerProduction).toFixed(2)
                    : ingredient.totalPrice.toFixed(2)

                  return (
                    <TableRow key={index} className="hover:bg-transparent border-gray-600">
                      <TableCell className="font-medium text-primary border-r border-gray-600">{ingredient.name}</TableCell>
                      <TableCell className="text-primary border-r border-gray-600">{cantidad}</TableCell>
                      <TableCell className="text-primary border-r border-gray-600">{ingredient.price.toFixed(2)}€/{ingredient.unit}</TableCell>
                      <TableCell className="text-primary font-semibold">{precioTotal}€</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Process */}
        <div className="bg-gray-700 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-primary mb-6">Proceso de elaboración</h3>
          
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
        </div>

        {/* Image */}
        <div className="bg-gray-700 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Foto del plato</h3>
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="w-full h-80 object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  )
} 