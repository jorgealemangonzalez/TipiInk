import { FirestoreDataConverter } from '../firebase/FirestoreDataConverter'
import { QueryDocumentSnapshot } from '../firebase/QueryDocumentSnapshot'
import { Recipe, RecipeDBModel } from './RecipeEntity'
import { getCostPerServing, getCostPercentage, getQuantityPerServing } from './RecipeEntityService'

export const recipeConverter: FirestoreDataConverter<Recipe, RecipeDBModel> = {
    // TODO WHAT HAPPENS ON UPDATES WHEN PARTIAL UPDATES HAPPEN, SHOULD THIS BE PARTIAL?
    // WHAT HAPPENS IF I USE SET WITH MERGE:true ?
    toFirestore: (recipe: Recipe) => {
        console.log('toFirestore, IS THIS PARTIAL?', { recipe })
        return {
            name: recipe.name,
            category: recipe.category,
            allergens: recipe.allergens,
            productionTime: recipe.productionTime,
            pvp: recipe.pvp,
            servingsPerProduction: recipe.servingsPerProduction,
            priceVariation: recipe.priceVariation,
            inMenu: recipe.inMenu,
            preparation: recipe.preparation,
            image: recipe.image,
            chunkId: recipe.chunkId,
            productionCost: recipe.productionCost,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt,
            ingredients: recipe.ingredients.map(ingredient => ({
                id: ingredient.id,
                type: ingredient.type,
                pricePerProduction: ingredient.pricePerProduction,
                quantityPerProduction: ingredient.quantityPerProduction,
            })),
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<Recipe, RecipeDBModel>, options?: any) => {
        console.log('fromFirestore', snapshot)
        let recipe: RecipeDBModel
        if (options) {
            recipe = snapshot.data(options)
        } else {
            recipe = snapshot.data()
        }
        const costPerServing = getCostPerServing(recipe, recipe.productionCost)
        const costPercentage = getCostPercentage(recipe, costPerServing)
        return {
            ...recipe,
            id: snapshot.id,
            costPercentage,
            costPerServing,
            ingredients: recipe.ingredients.map(ingredient => ({
                ...ingredient,
                quantityPerServing: getQuantityPerServing(ingredient, recipe),
            })),
        } as Recipe
    },
}
