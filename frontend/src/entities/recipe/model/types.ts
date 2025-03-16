export type Allergen = 'gluten' | 'crustaceans' | 'eggs' | 'fish' | 'peanuts' | 'soy' | 'dairy' | 'nuts' | 'celery' | 'mustard' | 'sesame' | 'sulphites' | 'lupin' | 'molluscs'

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: string
  quantityPerServing: number
  price: number
  totalPrice: number
}

import { FSDocument } from '../../../firebase/types'

export interface RecipeDetails extends FSDocument {
  name: string
  category: string
  allergens: Allergen[]
  productionTime: string
  price: number
  costPerServing: number
  servingsPerProduction: number
  productionCost: number
  costPercentage: number
  priceVariation: number
  inMenu: boolean
  ingredients: RecipeIngredient[]
  preparation: {
    prePreparation: string[]
    preparation: string[]
    conservation: string[]
  }
  image: string
} 