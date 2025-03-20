import { Timestamp } from 'firebase-admin/firestore'

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
    | 'molluscs';

export interface RecipeIngredientDBModel {
    name: string;
    quantityPerProduction: number;
    unit: string;
    pricePerUnit: number;
}

export interface RecipeIngredient extends RecipeIngredientDBModel {
    pricePerProduction: number;
    quantityPerServing: number;
}

export interface RecipePreparation {
    prePreparation: string[];
    preparation: string[];
    conservation: string[];
}
export interface RecipeDBModel {
    name: string;
    category?: string;
    allergens: Allergen[];
    productionTime?: string;
    pvp: number;
    servingsPerProduction: number;
    productionCost: number;
    priceVariation: number;
    inMenu: boolean;
    ingredients: RecipeIngredientDBModel[];
    preparation: RecipePreparation;
    image?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    chunkId?: string; // Trive Chunk ID
}

export interface Recipe extends Omit<RecipeDBModel, 'ingredients'> {
    id: string;
    costPercentage: number;
    costPerServing: number;
    ingredients: RecipeIngredient[];
}
