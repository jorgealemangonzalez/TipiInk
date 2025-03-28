import { z } from 'zod'

import { Allergen, IngredientUnit } from '@tipi/shared'

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

type IngredientUnitEnum = IngredientUnit | 'g' | 'ml'

export const IngredientUnitEnum = z.enum<IngredientUnitEnum, [IngredientUnitEnum, ...IngredientUnitEnum[]]>([
    'kg',
    'g',
    'l',
    'ml',
    'ud',
])

export const RecipeIngredientSchema = z.object({
    id: z.string().describe('ID of the ingredient or "new" if it is a new ingredient'),
    name: z.string().describe('Name of the ingredient'),
    quantityPerProduction: z.number().nullable().describe('Quantity per production'),
    unit: IngredientUnitEnum.describe('Unit of the ingredient'),
    pricePerUnit: z.number().nullable().describe('Price per unit'),
})

export const PreparationSchema = z.object({
    prePreparation: z
        .array(z.string())
        .describe('Pre-preparation steps those cuts and elaborations that need to be done before the preparation'),
    preparation: z.array(z.string()).describe('Steps to prepare the recipe'),
    conservation: z.array(z.string()).describe('Steps to conserve the recipe'),
})

// Base schema for recipe fields
export const BaseRecipeSchema = z.object({
    name: z.string().describe('Name of the recipe, first letter uppercase'),
    category: z.string().nullable().describe('Category of the recipe'),
    allergens: z.array(AllergenEnum).describe('Allergens of the recipe'),
    productionTime: z.string().nullable().describe('Production time of the recipe'),
    pvp: z.number().nullable().describe('Sell price per unit of the recipe'),
    servingsPerProduction: z.number().nullable().describe('Number of servings per production'),
    priceVariation: z.number().nullable().describe('Price variation of the recipe'),
    inMenu: z.boolean().nullable().describe('If the recipe is in the menu'),
    ingredients: z.array(RecipeIngredientSchema).describe('Ingredients of the recipe'),
    preparation: PreparationSchema.describe('Preparation steps of the recipe'),
})
