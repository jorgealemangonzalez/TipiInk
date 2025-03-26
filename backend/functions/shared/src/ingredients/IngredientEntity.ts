import { Timestamp } from 'src/firebase/Timestamp'

export enum IngredientUnits {
    KG = 'kg',
    L = 'l',
    UD = 'ud',
}

export type IngredientUnit = `${IngredientUnits}`

export interface IngredientDBModel {
    name: string
    unit: IngredientUnit
    pricePerUnit: number
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface Ingredient extends IngredientDBModel {
    id: string
}
