import {z} from 'zod'
import {Allergen} from './recipe'

// Define Zod schemas based on the existing types
const AllergenEnum = z.enum<Allergen, [Allergen, ...Allergen[]]>([
    'gluten',
    'crustaceans',
    'eggs',
    'fish',
    'peanuts',
    'soy',
    'dairy',
    'nuts',
    'celery',
    'mustard',
    'sesame',
    'sulphites',
    'lupin',
    'molluscs',
])

const RecipeIngredientSchema = z.object({
    name: z.string(),
    quantityPerProduction: z.number().optional(),
    unit: z.string().optional(),
    quantityPerServing: z.number().optional(),
    pricePerUnit: z.number().optional(),
    pricePerProduction: z.number().optional(),
})

const PreparationSchema = z.object({
    prePreparation: z.array(z.string()).optional(),
    preparation: z.array(z.string()).optional(),
    conservation: z.array(z.string()).optional(),
})

const RecipeDBModelSchema = z.object({
    name: z.string(),
    category: z.string().optional(),
    allergens: z.array(AllergenEnum).optional(),
    productionTime: z.string().optional(),
    pvp: z.number().optional(),
    costPerServing: z.number().optional(),
    servingsPerProduction: z.number().optional().describe('Number of servings per production'),
    productionCost: z.number().optional(),
    priceVariation: z.number().optional(),
    inMenu: z.boolean().optional(),
    ingredients: z.array(RecipeIngredientSchema).optional(),
    preparation: PreparationSchema.optional(),
    image: z.string().optional(),
})

// Define the CreateRecipeRequest schema
export const CreateRecipeRequestSchema = z.object({
    recipe: RecipeDBModelSchema,
})
