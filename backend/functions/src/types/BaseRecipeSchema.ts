import { z } from 'zod'
import { Allergen } from './recipe'

// Define Zod schemas based on the existing types
export const AllergenEnum = z.enum<Allergen, [Allergen, ...Allergen[]]>([
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

export const RecipeIngredientSchema = z.object({
    name: z.string().describe('Name of the ingredient'),
    quantityPerProduction: z.number().optional().describe('Quantity per production'),
    unit: z.string().optional().describe('Unit of the ingredient'),
    pricePerUnit: z.number().optional().describe('Price per unit'),
})

export const PreparationSchema = z.object({
    prePreparation: z
        .array(z.string())
        .optional()
        .describe('Pre-preparation steps those cuts and elaborations that need to be done before the preparation'),
    preparation: z.array(z.string()).optional().describe('Steps to prepare the recipe'),
    conservation: z.array(z.string()).optional().describe('Steps to conserve the recipe'),
})

// Base schema for recipe fields
export const BaseRecipeSchema = z.object({
    name: z.string().describe('Name of the recipe'),
    category: z.string().optional().describe('Category of the recipe'),
    allergens: z.array(AllergenEnum).optional().describe('Allergens of the recipe'),
    productionTime: z.string().optional().describe('Production time of the recipe'),
    pvp: z.number().optional().describe('Sell price per unit of the recipe'),
    servingsPerProduction: z.number().optional().describe('Number of servings per production'),
    priceVariation: z.number().optional().describe('Price variation of the recipe'),
    inMenu: z.boolean().optional().describe('If the recipe is in the menu'),
    ingredients: z.array(RecipeIngredientSchema).optional().describe('Ingredients of the recipe'),
    preparation: PreparationSchema.optional().describe('Preparation steps of the recipe'),
})
