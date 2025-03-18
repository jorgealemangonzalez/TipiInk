import {Timestamp} from 'firebase-admin/firestore'

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

export interface RecipeIngredient {
    name: string;
    quantityPerProduction: number;
    unit: string;
    quantityPerServing: number;
    pricePerUnit: number;
    pricePerProduction: number;
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
    costPerServing: number;
    servingsPerProduction: number;
    productionCost: number;
    priceVariation: number;
    inMenu: boolean;
    ingredients: RecipeIngredient[];
    preparation: RecipePreparation;
    image?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    chunkId?: string; // Trive Chunk ID
}

export interface Recipe extends RecipeDBModel {
    id: string;
    costPercentage: number;
}
