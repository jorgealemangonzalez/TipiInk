import { FirestoreDataConverter } from '../firebase/FirestoreDataConverter'
import { QueryDocumentSnapshot } from '../firebase/QueryDocumentSnapshot'
import { Ingredient, IngredientDBModel } from './IngredientEntity'

export const ingredientConverter: FirestoreDataConverter<Ingredient, IngredientDBModel> = {
    toFirestore: (ingredient: Ingredient) => ({
        name: ingredient.name,
        unit: ingredient.unit,
        pricePerUnit: ingredient.pricePerUnit,
        createdAt: ingredient.createdAt,
        updatedAt: ingredient.updatedAt,
    }),
    fromFirestore: (snapshot: QueryDocumentSnapshot<Ingredient, IngredientDBModel>) => {
        const data = snapshot.data()
        return {
            ...data,
            id: snapshot.id,
        }
    },
}
