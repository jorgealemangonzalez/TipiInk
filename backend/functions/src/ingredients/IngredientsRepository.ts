import { DocumentSnapshot, Timestamp } from 'firebase-admin/firestore'

import { Ingredient, IngredientDBModel, defaultIngredient, ingredientConverter } from '@tipi/shared'

import { firestore } from '../FirebaseInit'

export const getIngredientsRef = () =>
    firestore
        .collection('organizations/demo/ingredients')
        .withConverter<Ingredient, IngredientDBModel>(ingredientConverter)

export const getIngredientRef = (id: string) => getIngredientsRef().doc(id)

export const getIngredientById = async (id: string): Promise<Ingredient> => {
    const ingredient = await getIngredientRef(id).get()
    if (!ingredient.exists) {
        throw new Error(`Ingredient with id ${id} not found`)
    }
    return ingredient.data()
}

export const getIngredientsByIds = async (ids: string[]): Promise<Ingredient[]> => {
    if (!ids) {
        return []
    }

    const ingredients = await getIngredientsRef().where('id', 'in', ids).get()
    return ingredients.docs.map((doc: DocumentSnapshot<Ingredient, IngredientDBModel>) => doc.data())
}

export const createOrUpdateIngredient = async (
    ingredientData: Partial<Omit<Ingredient, 'createdAt' | 'updatedAt'>>,
): Promise<Ingredient['id']> => {
    // new is a special id for ingredients that are not in the database,
    // this is to help vapi always setting the id
    if (ingredientData.id && ingredientData.id !== 'new') {
        // TODO SEARCH THE ID IN TRIEVE BY THE INGREDIENT NAME
        await updateIngredient(ingredientData.id, ingredientData)
        return ingredientData.id
    } else {
        const ingredientRef = await getIngredientsRef().add({
            ...defaultIngredient,
            ...ingredientData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        })
        return ingredientRef.id
    }
}

export const updateIngredient = async (id: string, ingredientData: Partial<Omit<Ingredient, 'id'>>): Promise<void> => {
    if (ingredientData.pricePerUnit || ingredientData.unit || ingredientData.name) {
        await getIngredientRef(id).update({
            ...ingredientData,
            updatedAt: Timestamp.now(),
        })
    }
}

export const updateIngredientByExistingIngredient = async (
    existingIngredient: Ingredient,
    newIngredient: Partial<Omit<Ingredient, 'id'>>,
): Promise<void> => {
    if (
        newIngredient.pricePerUnit !== existingIngredient.pricePerUnit ||
        newIngredient.unit !== existingIngredient.unit ||
        newIngredient.name !== existingIngredient.name
    ) {
        await updateIngredient(existingIngredient.id, newIngredient)
    }
}
