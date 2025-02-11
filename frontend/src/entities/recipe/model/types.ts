export type Allergen = 'gluten' | 'crustaceans' | 'eggs' | 'fish' | 'peanuts' | 'soy' | 'dairy' | 'nuts' | 'celery' | 'mustard' | 'sesame' | 'sulphites' | 'lupin' | 'molluscs'

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: string
  quantityPerServing: number
  price: number
  totalPrice: number
}

export interface RecipeDetails {
  id: number
  name: string
  category: string
  allergens: Allergen[]
  productionTime: string
  price: number
  costPerServing: number
  servingsPerProduction: number
  productionCost: number
  ingredients: RecipeIngredient[]
  preparation: {
    prePreparation: string[]
    preparation: string[]
    conservation: string[]
  }
  image: string
  costPercentage: number
  priceVariation: number
} 