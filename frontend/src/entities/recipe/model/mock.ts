import { RecipeDetails, Location } from './types'

const generateLocationCosts = (baseCosts: {
  costPerServing: number
  productionCost: number
  ingredients: Array<{
    name: string
    price: number
    totalPrice: number
  }>
}) => {
  const locationMultipliers = {
    ibiza: 1,
    japon: 1.2,
    bahamas: 1.4
  }

  return Object.entries(locationMultipliers).reduce((acc, [location, multiplier]) => {
    return {
      ...acc,
      [location]: {
        costPerServing: baseCosts.costPerServing * multiplier,
        productionCost: baseCosts.productionCost * multiplier,
        ingredientsCosts: baseCosts.ingredients.map(ingredient => ({
          name: ingredient.name,
          price: ingredient.price * multiplier,
          totalPrice: ingredient.totalPrice * multiplier
        }))
      }
    }
  }, {} as { [key in Location]: typeof baseCosts & { ingredientsCosts: typeof baseCosts.ingredients } })
}

export const mockRecipes: RecipeDetails[] = [
  {
    id: 1,
    name: 'Paella Valenciana',
    category: 'Arroces',
    allergens: ['crustaceans', 'fish', 'molluscs'],
    productionTime: '45 min',
    price: 18.50,
    costPerServing: 4.85,
    servingsPerProduction: 4,
    productionCost: 19.40,
    costPercentage: 28,
    priceVariation: 2.5,
    ingredients: [
      {
        name: 'Arroz bomba',
        quantity: 400,
        unit: 'g',
        quantityPerServing: 100,
        price: 4.50,
        totalPrice: 1.80
      },
      {
        name: 'Azafrán',
        quantity: 2,
        unit: 'g',
        quantityPerServing: 0.5,
        price: 3000,
        totalPrice: 6.00
      },
      {
        name: 'Caldo de pescado',
        quantity: 1200,
        unit: 'ml',
        quantityPerServing: 300,
        price: 2.50,
        totalPrice: 3.00
      },
      {
        name: 'Gambas',
        quantity: 400,
        unit: 'g',
        quantityPerServing: 100,
        price: 18.00,
        totalPrice: 7.20
      },
      {
        name: 'Mejillones',
        quantity: 500,
        unit: 'g',
        quantityPerServing: 125,
        price: 6.00,
        totalPrice: 3.00
      },
      {
        name: 'Calamares',
        quantity: 300,
        unit: 'g',
        quantityPerServing: 75,
        price: 15.00,
        totalPrice: 4.50
      },
      {
        name: 'Pimiento rojo',
        quantity: 200,
        unit: 'g',
        quantityPerServing: 50,
        price: 2.80,
        totalPrice: 0.56
      },
      {
        name: 'Tomate',
        quantity: 200,
        unit: 'g',
        quantityPerServing: 50,
        price: 2.50,
        totalPrice: 0.50
      },
      {
        name: 'Aceite de oliva',
        quantity: 100,
        unit: 'ml',
        quantityPerServing: 25,
        price: 5.00,
        totalPrice: 0.50
      },
      {
        name: 'Ajo',
        quantity: 20,
        unit: 'g',
        quantityPerServing: 5,
        price: 6.00,
        totalPrice: 0.12
      },
      {
        name: 'Pimentón dulce',
        quantity: 10,
        unit: 'g',
        quantityPerServing: 2.5,
        price: 15.00,
        totalPrice: 0.15
      },
      {
        name: 'Sal',
        quantity: 15,
        unit: 'g',
        quantityPerServing: 3.75,
        price: 1.00,
        totalPrice: 0.02
      }
    ],
    preparation: {
      prePreparation: [
        'Limpiar y cortar las verduras en trozos uniformes para una cocción homogénea',
        'Preparar el caldo de pescado con espinas y cabezas de pescado fresco',
        'Pelar y picar finamente el ajo y la cebolla',
        'Limpiar los mariscos y pescados, eliminando cualquier resto de arena',
        'Hidratar el azafrán en agua caliente durante 10 minutos',
        'Preparar todos los ingredientes medidos y organizados (mise en place)'
      ],
      preparation: [
        'Calentar el aceite de oliva en la paella a fuego medio-alto',
        'Sofreír el ajo y la cebolla hasta que estén transparentes',
        'Añadir las verduras y cocinar hasta que estén tiernas',
        'Incorporar el arroz y tostar ligeramente durante 2 minutos',
        'Agregar el azafrán hidratado y remover para distribuir el color',
        'Verter el caldo caliente y distribuir todos los ingredientes',
        'Cocinar a fuego fuerte durante 10 minutos',
        'Reducir el fuego y cocinar 8 minutos más',
        'Dejar reposar tapado con papel de aluminio 5 minutos',
        'Comprobar el punto de cocción y el socarrat'
      ],
      conservation: [
        'Mantener en recipiente hermético para preservar la humedad',
        'Conservar en frío entre 0-4°C para garantizar la seguridad alimentaria',
        'Consumir preferentemente en las siguientes 24h para óptima calidad',
        'No recalentar más de una vez para mantener la textura',
        'Evitar congelar para no alterar la textura del arroz'
      ]
    },
    image: '/210820-casa-elias-02.jpg',
    inMenu: true,
    costs: generateLocationCosts({
      costPerServing: 4.85,
      productionCost: 19.40,
      ingredients: [
        {
          name: 'Arroz bomba',
          price: 4.50,
          totalPrice: 1.80
        },
        {
          name: 'Azafrán',
          price: 3000,
          totalPrice: 6.00
        },
        {
          name: 'Caldo de pescado',
          price: 2.50,
          totalPrice: 3.00
        },
        {
          name: 'Gambas',
          price: 18.00,
          totalPrice: 7.20
        },
        {
          name: 'Mejillones',
          price: 6.00,
          totalPrice: 3.00
        },
        {
          name: 'Calamares',
          price: 15.00,
          totalPrice: 4.50
        },
        {
          name: 'Pimiento rojo',
          price: 2.80,
          totalPrice: 0.56
        },
        {
          name: 'Tomate',
          price: 2.50,
          totalPrice: 0.50
        },
        {
          name: 'Aceite de oliva',
          price: 5.00,
          totalPrice: 0.50
        },
        {
          name: 'Ajo',
          price: 6.00,
          totalPrice: 0.12
        },
        {
          name: 'Pimentón dulce',
          price: 15.00,
          totalPrice: 0.15
        },
        {
          name: 'Sal',
          price: 1.00,
          totalPrice: 0.02
        }
      ]
    })
  },
  {
    id: 2,
    name: 'Risotto de Setas',
    category: 'Arroces',
    allergens: ['milk', 'celery'],
    productionTime: '35 min',
    price: 16.50,
    costPerServing: 3.85,
    servingsPerProduction: 4,
    productionCost: 15.40,
    costPercentage: 26,
    priceVariation: 2.0,
    ingredients: [
      {
        name: 'Arroz arborio',
        quantity: 320,
        unit: 'g',
        quantityPerServing: 80,
        price: 5.50,
        totalPrice: 1.76
      },
      {
        name: 'Setas variadas',
        quantity: 400,
        unit: 'g',
        quantityPerServing: 100,
        price: 12.00,
        totalPrice: 4.80
      }
    ],
    preparation: {
      prePreparation: [
        'Limpiar y cortar las setas',
        'Preparar el caldo de verduras caliente',
        'Picar la cebolla y el ajo'
      ],
      preparation: [
        'Sofreír la cebolla y el ajo',
        'Añadir el arroz y tostar',
        'Incorporar el vino blanco',
        'Añadir el caldo poco a poco',
        'Mantener a fuego medio removiendo constantemente'
      ],
      conservation: [
        'Conservar en frío',
        'Consumir en 24 horas',
        'No congelar'
      ]
    },
    image: '/risotto-setas.jpg',
    inMenu: true,
    costs: generateLocationCosts({
      costPerServing: 3.85,
      productionCost: 15.40,
      ingredients: [
        {
          name: 'Arroz arborio',
          price: 5.50,
          totalPrice: 1.76
        },
        {
          name: 'Setas variadas',
          price: 12.00,
          totalPrice: 4.80
        }
      ]
    })
  },
  {
    id: 3,
    name: 'Tataki de Atún',
    category: 'Pescados',
    allergens: ['fish', 'soy'],
    productionTime: '20 min',
    price: 22.00,
    costPerServing: 5.50,
    servingsPerProduction: 4,
    productionCost: 22.00,
    costPercentage: 29,
    priceVariation: 3.0,
    ingredients: [
      {
        name: 'Atún rojo',
        quantity: 600,
        unit: 'g',
        quantityPerServing: 150,
        price: 45.00,
        totalPrice: 27.00
      }
    ],
    preparation: {
      prePreparation: [
        'Preparar la marinada',
        'Limpiar el atún'
      ],
      preparation: [
        'Marcar el atún por todos los lados',
        'Dejar reposar',
        'Cortar en láminas finas'
      ],
      conservation: [
        'Consumir en el momento',
        'No conservar más de 2 horas'
      ]
    },
    image: '/tataki-atun.jpg',
    inMenu: false,
    costs: generateLocationCosts({
      costPerServing: 5.50,
      productionCost: 22.00,
      ingredients: [
        {
          name: 'Atún rojo',
          price: 45.00,
          totalPrice: 27.00
        }
      ]
    })
  },
  {
    id: 4,
    name: 'Canelones de Espinacas',
    category: 'Pasta',
    allergens: ['gluten', 'milk', 'eggs'],
    productionTime: '60 min',
    price: 14.50,
    costPerServing: 3.20,
    servingsPerProduction: 6,
    productionCost: 19.20,
    costPercentage: 27,
    priceVariation: 2.0,
    ingredients: [
      {
        name: 'Placas de canelones',
        quantity: 18,
        unit: 'ud',
        quantityPerServing: 3,
        price: 3.50,
        totalPrice: 3.50
      }
    ],
    preparation: {
      prePreparation: [
        'Cocer la pasta',
        'Preparar el relleno',
        'Hacer la bechamel'
      ],
      preparation: [
        'Rellenar los canelones',
        'Cubrir con bechamel',
        'Gratinar'
      ],
      conservation: [
        'Conservar en frío',
        'Consumir en 48 horas'
      ]
    },
    image: '/canelones-espinacas.jpg',
    inMenu: true,
    costs: generateLocationCosts({
      costPerServing: 3.20,
      productionCost: 19.20,
      ingredients: [
        {
          name: 'Placas de canelones',
          price: 3.50,
          totalPrice: 3.50
        }
      ]
    })
  },
  {
    id: 5,
    name: 'Ceviche de Corvina',
    category: 'Pescados',
    allergens: ['fish'],
    productionTime: '25 min',
    price: 19.00,
    costPerServing: 4.50,
    servingsPerProduction: 4,
    productionCost: 18.00,
    costPercentage: 24,
    priceVariation: 2.5,
    ingredients: [
      {
        name: 'Corvina',
        quantity: 600,
        unit: 'g',
        quantityPerServing: 150,
        price: 25.00,
        totalPrice: 15.00
      }
    ],
    preparation: {
      prePreparation: [
        'Cortar el pescado',
        'Preparar la leche de tigre'
      ],
      preparation: [
        'Marinar el pescado',
        'Añadir los demás ingredientes',
        'Servir frío'
      ],
      conservation: [
        'Consumir en el momento',
        'No conservar más de 2 horas'
      ]
    },
    image: '/ceviche-corvina.jpg',
    inMenu: true,
    costs: generateLocationCosts({
      costPerServing: 4.50,
      productionCost: 18.00,
      ingredients: [
        {
          name: 'Corvina',
          price: 25.00,
          totalPrice: 15.00
        }
      ]
    })
  },
  {
    id: 6,
    name: 'Carrilleras al Vino Tinto',
    category: 'Carnes',
    allergens: ['celery', 'sulphites'],
    productionTime: '180 min',
    price: 17.50,
    costPerServing: 4.00,
    servingsPerProduction: 6,
    productionCost: 24.00,
    costPercentage: 35,
    priceVariation: 2.0,
    ingredients: [
      {
        name: 'Carrilleras de cerdo',
        quantity: 1200,
        unit: 'g',
        quantityPerServing: 200,
        price: 12.00,
        totalPrice: 14.40
      }
    ],
    preparation: {
      prePreparation: [
        'Limpiar las carrilleras',
        'Preparar la verdura'
      ],
      preparation: [
        'Sellar la carne',
        'Hacer el sofrito',
        'Cocinar a fuego lento'
      ],
      conservation: [
        'Conservar en frío',
        'Consumir en 72 horas'
      ]
    },
    image: '/carrilleras-vino.jpg',
    inMenu: false,
    costs: generateLocationCosts({
      costPerServing: 4.00,
      productionCost: 24.00,
      ingredients: [
        {
          name: 'Carrilleras de cerdo',
          price: 12.00,
          totalPrice: 14.40
        }
      ]
    })
  },
  {
    id: 7,
    name: 'Tarta de Queso',
    category: 'Postres',
    allergens: ['milk', 'eggs', 'gluten'],
    productionTime: '90 min',
    price: 6.50,
    costPerServing: 1.20,
    servingsPerProduction: 12,
    productionCost: 14.40,
    costPercentage: 23,
    priceVariation: 1.5,
    ingredients: [
      {
        name: 'Queso crema',
        quantity: 750,
        unit: 'g',
        quantityPerServing: 62.5,
        price: 4.50,
        totalPrice: 3.38
      }
    ],
    preparation: {
      prePreparation: [
        'Preparar la base',
        'Mezclar los ingredientes'
      ],
      preparation: [
        'Hornear a baja temperatura',
        'Enfriar completamente'
      ],
      conservation: [
        'Conservar en frío',
        'Consumir en 5 días'
      ]
    },
    image: '/tarta-queso.jpg',
    inMenu: true,
    costs: generateLocationCosts({
      costPerServing: 1.20,
      productionCost: 14.40,
      ingredients: [
        {
          name: 'Queso crema',
          price: 4.50,
          totalPrice: 3.38
        }
      ]
    })
  },
  {
    id: 8,
    name: 'Pulpo a la Gallega',
    category: 'Pescados',
    allergens: ['molluscs'],
    productionTime: '60 min',
    price: 24.00,
    costPerServing: 6.00,
    servingsPerProduction: 4,
    productionCost: 24.00,
    costPercentage: 25,
    priceVariation: 3.0,
    ingredients: [
      {
        name: 'Pulpo',
        quantity: 1200,
        unit: 'g',
        quantityPerServing: 300,
        price: 18.00,
        totalPrice: 21.60
      }
    ],
    preparation: {
      prePreparation: [
        'Congelar el pulpo',
        'Preparar la cocción'
      ],
      preparation: [
        'Cocer el pulpo',
        'Cortar en rodajas',
        'Aliñar'
      ],
      conservation: [
        'Conservar en frío',
        'Consumir en 24 horas'
      ]
    },
    image: '/pulpo-gallega.jpg',
    inMenu: true,
    costs: generateLocationCosts({
      costPerServing: 6.00,
      productionCost: 24.00,
      ingredients: [
        {
          name: 'Pulpo',
          price: 18.00,
          totalPrice: 21.60
        }
      ]
    })
  },
  {
    id: 9,
    name: 'Gazpacho Andaluz',
    category: 'Sopas',
    allergens: [],
    productionTime: '30 min',
    price: 7.50,
    costPerServing: 1.50,
    servingsPerProduction: 6,
    productionCost: 9.00,
    costPercentage: 26,
    priceVariation: 1.0,
    ingredients: [
      {
        name: 'Tomates',
        quantity: 1000,
        unit: 'g',
        quantityPerServing: 166,
        price: 2.50,
        totalPrice: 2.50
      }
    ],
    preparation: {
      prePreparation: [
        'Lavar las verduras',
        'Pelar los tomates'
      ],
      preparation: [
        'Triturar todos los ingredientes',
        'Colar',
        'Enfriar'
      ],
      conservation: [
        'Conservar en frío',
        'Consumir en 48 horas'
      ]
    },
    image: '/gazpacho.jpg',
    inMenu: false,
    costs: generateLocationCosts({
      costPerServing: 1.50,
      productionCost: 9.00,
      ingredients: [
        {
          name: 'Tomates',
          price: 2.50,
          totalPrice: 2.50
        }
      ]
    })
  },
  {
    id: 10,
    name: 'Rabo de Toro',
    category: 'Carnes',
    allergens: ['celery', 'sulphites'],
    productionTime: '240 min',
    price: 21.00,
    costPerServing: 5.25,
    servingsPerProduction: 4,
    productionCost: 21.00,
    costPercentage: 24,
    priceVariation: 2.5,
    ingredients: [
      {
        name: 'Rabo de toro',
        quantity: 1600,
        unit: 'g',
        quantityPerServing: 400,
        price: 12.00,
        totalPrice: 19.20
      }
    ],
    preparation: {
      prePreparation: [
        'Limpiar la carne',
        'Preparar las verduras'
      ],
      preparation: [
        'Sellar la carne',
        'Hacer el sofrito',
        'Cocinar a fuego lento'
      ],
      conservation: [
        'Conservar en frío',
        'Consumir en 72 horas'
      ]
    },
    image: '/rabo-toro.jpg',
    inMenu: true,
    costs: generateLocationCosts({
      costPerServing: 5.25,
      productionCost: 21.00,
      ingredients: [
        {
          name: 'Rabo de toro',
          price: 12.00,
          totalPrice: 19.20
        }
      ]
    })
  },
  {
    id: 11,
    name: 'Sushi Variado',
    category: 'Asiático',
    allergens: ['fish', 'crustaceans', 'soy', 'sesame'],
    productionTime: '90 min',
    price: 25.00,
    costPerServing: 6.25,
    servingsPerProduction: 4,
    productionCost: 25.00,
    costPercentage: 28,
    priceVariation: 3.0,
    ingredients: [
      {
        name: 'Arroz sushi',
        quantity: 400,
        unit: 'g',
        quantityPerServing: 100,
        price: 4.50,
        totalPrice: 1.80
      }
    ],
    preparation: {
      prePreparation: [
        'Preparar el arroz',
        'Cortar el pescado',
        'Preparar las verduras'
      ],
      preparation: [
        'Montar los rolls',
        'Cortar en piezas',
        'Preparar las salsas'
      ],
      conservation: [
        'Conservar en frío',
        'Consumir en 24 horas'
      ]
    },
    image: '/sushi-variado.jpg',
    inMenu: false,
    costs: generateLocationCosts({
      costPerServing: 6.25,
      productionCost: 25.00,
      ingredients: [
        {
          name: 'Arroz sushi',
          price: 4.50,
          totalPrice: 1.80
        }
      ]
    })
  }
] 