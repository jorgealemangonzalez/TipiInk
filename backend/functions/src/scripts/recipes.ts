import { CreateRecipeRequest } from '../types/CreateRecipe'

export const recipes: CreateRecipeRequest['recipe'][] = [
    {
        name: 'Chips de morena con pisto murciano',
        category: 'Entrante',
        allergens: ['fish', 'gluten'],
        productionTime: '1 hora',
        pvp: 15.0,
        servingsPerProduction: 4,
        priceVariation: 2.5,
        inMenu: true,
        ingredients: [
            { name: 'Morena fresca', quantityPerProduction: 250, unit: 'g', pricePerUnit: 18 },
            { name: 'Tomate raf maduro', quantityPerProduction: 350, unit: 'g', pricePerUnit: 3 },
            { name: 'Pimiento verde italiano', quantityPerProduction: 120, unit: 'g', pricePerUnit: 1.2 },
            { name: 'Cebolla dulce', quantityPerProduction: 120, unit: 'g', pricePerUnit: 1.5 },
            { name: 'Aceite de oliva virgen extra premium', quantityPerProduction: 60, unit: 'ml', pricePerUnit: 10 },
            { name: 'Harina de trigo ecológica', quantityPerProduction: 50, unit: 'g', pricePerUnit: 0.6 },
        ],
        preparation: {
            prePreparation: ['Limpiar y filetear cuidadosamente la morena', 'Picar verduras en brunoise muy fina'],
            preparation: [
                'Enharinar ligeramente los filetes de morena y freír hasta lograr textura crujiente y dorada',
                'Cocinar lentamente las verduras en aceite de oliva premium hasta obtener un pisto suave y aromático',
                'Presentar en plato elegante con el pisto de base y chips de morena encima',
            ],
            conservation: ['Servir inmediatamente después de su elaboración'],
        },
    },
    {
        name: 'Tartar de tomate con merengue de aquafaba',
        category: 'Vegetariano',
        allergens: [],
        productionTime: '45 min',
        pvp: 13.0,
        servingsPerProduction: 4,
        priceVariation: 1.8,
        inMenu: true,
        ingredients: [
            { name: 'Tomate ecológico variedad antigua', quantityPerProduction: 400, unit: 'g', pricePerUnit: 4 },
            { name: 'Aquafaba', quantityPerProduction: 120, unit: 'ml', pricePerUnit: 0.8 },
            { name: 'Aceite de oliva virgen extra premium', quantityPerProduction: 25, unit: 'ml', pricePerUnit: 10 },
            { name: 'Microbrotes de albahaca', quantityPerProduction: 15, unit: 'g', pricePerUnit: 3 },
        ],
        preparation: {
            prePreparation: [
                'Seleccionar y picar tomates en cubos muy pequeños',
                'Montar aquafaba con precisión a punto de nieve',
            ],
            preparation: [
                'Aliñar delicadamente los tomates con aceite de oliva premium y sal en escamas',
                'Formar el tartar en el centro del plato',
                'Cubrir suavemente con merengue de aquafaba',
                'Decorar artísticamente con microbrotes de albahaca',
            ],
            conservation: ['Mantener refrigerado y servir inmediatamente'],
        },
    },
    {
        name: 'Estofado de setas con yema de huevo campero y judía verde',
        category: 'Principal',
        allergens: ['eggs'],
        productionTime: '1 hora 30 min',
        pvp: 22.0,
        servingsPerProduction: 4,
        priceVariation: 3.0,
        inMenu: true,
        ingredients: [
            { name: 'Setas silvestres mixtas de temporada', quantityPerProduction: 450, unit: 'g', pricePerUnit: 15 },
            { name: 'Yema de huevo campero ecológico', quantityPerProduction: 4, unit: 'uds', pricePerUnit: 0.7 },
            { name: 'Judías verdes frescas ecológicas', quantityPerProduction: 200, unit: 'g', pricePerUnit: 4 },
            { name: 'Caldo de verduras concentrado casero', quantityPerProduction: 350, unit: 'ml', pricePerUnit: 2 },
            { name: 'Ajo negro', quantityPerProduction: 15, unit: 'g', pricePerUnit: 1 },
            { name: 'Aceite de oliva virgen extra premium', quantityPerProduction: 40, unit: 'ml', pricePerUnit: 10 },
        ],
        preparation: {
            prePreparation: [
                'Seleccionar y limpiar minuciosamente setas silvestres',
                'Cortar judías verdes con precisión en juliana',
            ],
            preparation: [
                'Saltear setas con ajo negro en aceite premium',
                'Añadir caldo concentrado y estofar lentamente hasta lograr textura y sabor intensos',
                'Escaldar brevemente judías verdes para mantener su frescura',
                'Servir las setas en un plato hondo con la yema de huevo campero ligeramente templada y judías verdes dispuestas con elegancia alrededor',
            ],
            conservation: ['Consumir recién hecho y caliente'],
        },
    },
]
