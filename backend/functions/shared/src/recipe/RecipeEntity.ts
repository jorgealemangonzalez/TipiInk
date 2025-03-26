import { Timestamp } from 'src/firebase/Timestamp'
import { EntityUpdate } from 'src/typing'

import { Ingredient } from '../ingredients/IngredientEntity'

export type Allergen =
    | 'gluten'
    | 'crustaceans'
    | 'eggs'
    | 'fish'
    | 'peanuts'
    | 'soy'
    | 'dairy'
    | 'nuts'
    | 'celery'
    | 'mustard'
    | 'sesame'
    | 'sulphites'
    | 'lupin'
    | 'molluscs'

export enum RecipeIngredientType {
    INGREDIENT = 'ingredient',
    RECIPE = 'recipe',
}

export interface RecipeIngredientDBModel {
    id: Ingredient['id']
    type: `${RecipeIngredientType}`
    pricePerProduction: number // Updated every time the ingredient price changes
    quantityPerProduction: number
}

export interface RecipeIngredient extends RecipeIngredientDBModel {
    quantityPerServing: number
}

export interface FullRecipeIngredient extends RecipeIngredient, Ingredient {}

export interface RecipePreparation {
    prePreparation: string[]
    preparation: string[]
    conservation: string[]
}

export interface RecipeDBModel {
    name: string
    category?: string
    allergens: Allergen[]
    productionTime?: string
    pvp: number
    servingsPerProduction: number
    priceVariation: number
    inMenu: boolean
    ingredients: RecipeIngredientDBModel[]
    preparation: RecipePreparation
    image?: string
    chunkId?: string // Trive Chunk ID
    productionCost: number // Updated every time any ingredient price changes
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface Recipe extends Omit<RecipeDBModel, 'ingredients'> {
    id: string
    costPercentage: number
    costPerServing: number
    ingredients: RecipeIngredient[]
}

export interface RecipeWithIngredients extends Omit<Recipe, 'ingredients'> {
    ingredients: FullRecipeIngredient[]
}

export const defaultRecipeData: EntityUpdate<RecipeDBModel> = {
    name: '',
    category: '',
    allergens: [],
    productionTime: '',
    pvp: 0,
    servingsPerProduction: 1,
    priceVariation: 0,
    inMenu: false,
    ingredients: [],
    preparation: {
        prePreparation: [],
        preparation: [],
        conservation: [],
    },
    image: '',
    chunkId: '',
    productionCost: 0,
}
