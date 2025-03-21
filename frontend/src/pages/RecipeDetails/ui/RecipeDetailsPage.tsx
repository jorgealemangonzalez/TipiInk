import { ChangeEvent, FC, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { BookOpen, Check, ChevronsUpDown, Info, Loader2, Upload } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRecipes } from '@/entities/recipe/model/recipeHooks'
import { uploadFileToStorage } from '@/firebase/fileStorage'
import { cn } from '@/shared/lib/utils'
import { AllergenIcon } from '@/shared/ui/allergen-icon'
import { BackButton } from '@/shared/ui/back-button'
import { Allergen } from '@monorepo/functions/src/recipes/recipe'

// Recipe categories available
const RECIPE_CATEGORIES = ['Arroces', 'Pescados', 'Pasta', 'Carnes', 'Postres', 'Asiático', 'Otros']

// Allergens available with their display names
const ALLERGENS = [
    { value: 'gluten' as Allergen, label: 'Gluten' },
    { value: 'crustaceans' as Allergen, label: 'Crustáceos' },
    { value: 'eggs' as Allergen, label: 'Huevos' },
    { value: 'fish' as Allergen, label: 'Pescado' },
    { value: 'peanuts' as Allergen, label: 'Cacahuetes' },
    { value: 'soy' as Allergen, label: 'Soja' },
    { value: 'dairy' as Allergen, label: 'Lácteos' },
    { value: 'nuts' as Allergen, label: 'Frutos secos' },
    { value: 'celery' as Allergen, label: 'Apio' },
    { value: 'mustard' as Allergen, label: 'Mostaza' },
    { value: 'sesame' as Allergen, label: 'Sésamo' },
    { value: 'sulphites' as Allergen, label: 'Sulfitos' },
    { value: 'lupin' as Allergen, label: 'Altramuces' },
    { value: 'molluscs' as Allergen, label: 'Moluscos' },
]

const getPercentageColor = (percentage: number): string => {
    if (percentage < 20) return 'text-emerald-500'
    if (percentage <= 25) return 'text-green-400'
    if (percentage <= 30) return 'text-yellow-400'
    if (percentage <= 32) return 'text-orange-400'
    return 'text-red-500'
}

const AllergenSelector: FC<{
    selected: Allergen[]
    onChange: (values: Allergen[]) => void
}> = ({ selected, onChange }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='flex items-center gap-2'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className='group flex cursor-pointer items-center gap-1 pr-1.5'>
                        {selected.length > 0 ? (
                            <>
                                <div className='flex gap-1'>
                                    {selected.map(allergen => (
                                        <AllergenIcon key={allergen} allergen={allergen} />
                                    ))}
                                </div>
                                <ChevronsUpDown className='h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50' />
                            </>
                        ) : (
                            <>
                                <p className='text-primary/50 text-xs italic'>Sin alérgenos</p>
                                <ChevronsUpDown className='h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50' />
                            </>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent className='w-[280px] p-0' align='end'>
                    <Command>
                        <CommandInput placeholder='Buscar alérgeno...' />
                        <CommandList>
                            <CommandEmpty>No hay coincidencias.</CommandEmpty>
                            <CommandGroup>
                                {ALLERGENS.map(option => {
                                    const isSelected = selected.includes(option.value)
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => {
                                                onChange(
                                                    isSelected
                                                        ? selected.filter(value => value !== option.value)
                                                        : [...selected, option.value],
                                                )
                                                setOpen(true)
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    'border-primary/20 mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                    isSelected ? 'bg-primary' : 'opacity-50',
                                                )}
                                            >
                                                {isSelected && <Check className='text-primary-foreground h-3 w-3' />}
                                            </div>
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
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

    if (isLoading) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <p className='text-primary text-xl'>Cargando receta...</p>
            </div>
        )
    }

    if (!recipe) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <p className='text-primary text-xl'>Receta no encontrada</p>
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
            const imageUrl = await uploadFileToStorage(filePath, file, totalUploaded => {
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

    const handleAllergensChange = async (allergens: Allergen[]) => {
        if (!recipe) return
        await updateRecipe(recipe.id, { allergens })
    }

    const handleProductionTimeChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!recipe) return
        const minutes = e.target.value
        await updateRecipe(recipe.id, { productionTime: `${minutes} min` })
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
        <div className='flex min-h-screen flex-col'>
            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='relative flex items-center justify-center'>
                    <BackButton className='absolute left-0' />
                    <h1 className='text-primary text-2xl font-bold'>Receta</h1>
                    <div
                        onClick={() => toggleRecipeMenuStatus(recipe.id)}
                        className={cn(
                            'absolute right-0 flex cursor-pointer items-center justify-center rounded-full p-2 transition-opacity hover:opacity-80',
                            recipe.inMenu ? 'bg-primary' : '',
                        )}
                    >
                        <BookOpen className={cn('h-7 w-7', recipe.inMenu ? 'text-black' : 'text-primary')} />
                    </div>
                </div>

                {/* Initial Breakdown */}
                <Card className='border-border bg-card'>
                    <CardHeader>
                        <div className='flex items-start justify-between'>
                            <div className='flex flex-col space-y-1'>
                                <div className='flex items-center gap-3'>
                                    <h2 className='text-primary text-2xl font-bold'>{recipe.name}</h2>
                                </div>
                                <div>
                                    <Select
                                        defaultValue={recipe.category || undefined}
                                        onValueChange={handleCategoryChange}
                                    >
                                        <SelectTrigger className='h-6 w-40 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
                                            <SelectValue
                                                placeholder='Seleccionar categoría'
                                                className='text-primary/50 italic'
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RECIPE_CATEGORIES.map(category => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <AllergenSelector selected={recipe.allergens} onChange={handleAllergensChange} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Pricing and Production Info */}
                        <div className='text-primary grid grid-cols-2 gap-4'>
                            <div>
                                <p className='text-primary/80 text-sm'>PVP</p>
                                <p className='text-xl font-semibold'>{recipe.pvp.toFixed(2)}€</p>
                            </div>
                            <div>
                                <p className='text-primary/80 flex items-center gap-1 text-sm'>
                                    Coste por ración
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className='text-primary/60 h-3.5 w-3.5 cursor-help' />
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side='top'
                                                align='center'
                                                className='text-primary border-gray-800 bg-gray-900'
                                            >
                                                <p className='max-w-60 text-xs'>Suma de los costes de ingredientes</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </p>
                                <p className='text-xl font-semibold'>
                                    <span className={getPercentageColor(recipe.costPercentage)}>
                                        {recipe.costPerServing.toFixed(2)}€
                                    </span>
                                    <span className='ml-2 text-sm'>
                                        (
                                        <span className={getPercentageColor(recipe.costPercentage)}>
                                            {recipe.costPercentage.toFixed(0)}% Coste
                                        </span>
                                        )
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className='text-primary/80 text-sm'>Raciones por producción</p>
                                <p className='text-xl font-semibold'>{recipe.servingsPerProduction}</p>
                            </div>
                            <div>
                                <p className='text-primary/80 text-sm'>Coste por producción</p>
                                <p className='text-xl font-semibold'>{recipe.productionCost.toFixed(2)}€</p>
                            </div>
                        </div>

                        {/* Production Time */}
                        <div className='border-border mt-6 flex items-center justify-between border-t pt-4'>
                            <p className='text-primary/80 text-sm'>Tiempo de producción</p>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    className='text-primary h-8 w-16 border-none bg-transparent text-right text-xl font-semibold focus:outline-none'
                                    value={extractMinutes(recipe.productionTime)}
                                    onChange={handleProductionTimeChange}
                                    placeholder='0'
                                />
                                <span className='text-primary text-xl font-semibold'>min</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ingredients */}
                <Card className='border-border bg-card'>
                    <CardHeader className='flex flex-col gap-6'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-primary text-2xl font-bold'>Ingredientes</h2>
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
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recipe.ingredients.length > 0 ? (
                            <div className='space-y-4'>
                                {recipe.ingredients.map((ingredient, index) => {
                                    const cantidad = showPerServing
                                        ? `${ingredient.quantityPerServing} ${ingredient.unit}`
                                        : `${ingredient.quantityPerProduction} ${ingredient.unit}`

                                    const precioTotal = showPerServing
                                        ? (ingredient.pricePerProduction / recipe.servingsPerProduction).toFixed(2)
                                        : ingredient.pricePerProduction.toFixed(2)

                                    return (
                                        <div key={index} className='flex flex-col space-y-2'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex-1'>
                                                    <h3 className='text-primary text-lg font-medium'>
                                                        {ingredient.name}
                                                    </h3>
                                                    <p className='text-primary/60 text-sm'>
                                                        {ingredient.pricePerUnit.toFixed(2)}€/{ingredient.unit}
                                                    </p>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='text-primary text-lg font-medium'>{cantidad}</p>
                                                    <p className='text-primary text-sm font-semibold'>{precioTotal}€</p>
                                                </div>
                                            </div>
                                            {index < recipe.ingredients.length - 1 && (
                                                <div className='bg-border h-px' />
                                            )}
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

                {/* Process */}
                <Card className='border-border bg-card'>
                    <CardHeader>
                        <h2 className='text-primary text-2xl font-bold'>Proceso de elaboración</h2>
                    </CardHeader>
                    <CardContent>
                        <div className='relative flex gap-1' ref={processContainerRef}>
                            {/* Pasos del proceso */}
                            <div className='flex-1 space-y-16'>
                                {/* Preelaboración */}
                                {recipe.preparation.prePreparation.length > 0 && (
                                    <div className='transition-all duration-300'>
                                        <h4 className='text-primary mb-4 text-lg font-semibold'>Preelaboración</h4>
                                        <ul className='list-none space-y-3'>
                                            {recipe.preparation.prePreparation.map((step, index) => (
                                                <li key={index} className='text-primary/80 flex items-start gap-3'>
                                                    <span className='text-primary mt-1'>•</span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Elaboración */}
                                {recipe.preparation.preparation.length > 0 && (
                                    <div className='transition-all duration-300'>
                                        <h4 className='text-primary mb-4 text-lg font-semibold'>Elaboración</h4>
                                        <ul className='list-none space-y-3'>
                                            {recipe.preparation.preparation.map((step, index) => (
                                                <li key={index} className='text-primary/80 flex items-start gap-3'>
                                                    <span className='text-primary mt-1'>•</span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Conservación */}
                                {recipe.preparation.conservation.length > 0 && (
                                    <div className='transition-all duration-300'>
                                        <h4 className='text-primary mb-4 text-lg font-semibold'>Conservación</h4>
                                        <ul className='list-none space-y-3'>
                                            {recipe.preparation.conservation.map((step, index) => (
                                                <li key={index} className='text-primary/80 flex items-start gap-3'>
                                                    <span className='text-primary mt-1'>•</span>
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
                                        <div className='text-primary/50 flex flex-col items-center justify-center py-8'>
                                            <p>No hay pasos de elaboración definidos</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Image */}
                <Card className='border-border bg-card'>
                    <CardHeader>
                        <h2 className='text-primary text-2xl font-bold'>Foto del plato</h2>
                    </CardHeader>
                    <CardContent>
                        {recipe.image ? (
                            <div className='group relative'>
                                <img
                                    src={recipe.image}
                                    alt={recipe.name}
                                    className={cn(
                                        'h-80 w-full rounded-lg object-cover transition-all duration-150',
                                        isUploading && 'opacity-60',
                                    )}
                                />
                                {/* Hover overlay with upload button */}
                                <div
                                    onClick={triggerFileInput}
                                    className={cn(
                                        'absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-lg transition-all duration-150 active:scale-95',
                                        isUploading ? 'bg-black/50' : 'bg-black/30 opacity-0 group-hover:opacity-100',
                                    )}
                                >
                                    <input
                                        type='file'
                                        ref={fileInputRef}
                                        className='hidden'
                                        accept='image/*'
                                        onChange={handleImageUpload}
                                    />
                                    {isUploading ? (
                                        <div className='flex flex-col items-center gap-2'>
                                            <div className='relative'>
                                                <Loader2 className='size-20 animate-spin text-white' />
                                                <div className='absolute inset-0 flex items-center justify-center'>
                                                    <span className='text-xs font-medium text-white'>
                                                        {uploadProgress}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Upload className='h-12 w-12 text-white' />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={triggerFileInput}
                                className='border-primary/30 active:border-primary/60 flex h-80 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed bg-black/5 transition-all duration-150 active:scale-[0.98] active:bg-black/10'
                            >
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    className='hidden'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                />
                                {isUploading ? (
                                    <div className='flex flex-col items-center gap-2'>
                                        <div className='relative'>
                                            <Loader2 className='text-primary/60 h-12 w-12 animate-spin' />
                                            <div className='absolute inset-0 flex items-center justify-center'>
                                                <span className='text-primary/90 text-xs font-medium'>
                                                    {uploadProgress}%
                                                </span>
                                            </div>
                                        </div>
                                        <p className='text-primary/70'>Subiendo imagen... ({uploadProgress}%)</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className='text-primary/60 h-12 w-12' />
                                        <p className='text-primary/70 max-w-sm text-center'>
                                            Sube una foto del plato terminado.
                                        </p>
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
