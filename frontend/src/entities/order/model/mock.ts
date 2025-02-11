import { PendingOrder } from './types'

export const MOCK_ORDERS: PendingOrder[] = [
  {
    supplierName: "Prodesco",
    category: 'carne',
    requestedDeliveryTime: new Date(2024, 2, 14, 10, 0),
    items: [
      { name: "Solomillo de cerdo", quantity: 5, unitPrice: 12.50, unitFormat: 'kg', observations: "Limpio y cortado" },
      { name: "Pechuga de pollo", quantity: 10, unitPrice: 8.75, unitFormat: 'kg', observations: "Fileteada" },
      { name: "Costillas de cerdo", quantity: 3, unitPrice: 15.00, unitFormat: 'kg', observations: "Cortadas en tiras" }
    ],
    estimatedPrice: 1250.50
  },
  {
    supplierName: "Pescadería La Central",
    category: 'pescado',
    requestedDeliveryTime: new Date(2024, 2, 14, 11, 30),
    items: [
      { name: "Lubina fresca", quantity: 8, unitPrice: 22.50, unitFormat: 'kg', observations: "Limpia y sin espinas" },
      { name: "Salmón", quantity: 5, unitPrice: 18.75, unitFormat: 'kg', observations: "En lomos" },
      { name: "Gambas", quantity: 2, unitPrice: 35.00, unitFormat: 'kg', observations: "Peladas y cocidas" }
    ],
    estimatedPrice: 850.75
  },
  {
    supplierName: "Frutas el Huertano",
    category: 'frutaVerdura',
    requestedDeliveryTime: new Date(2024, 2, 14, 9, 0),
    items: [
      { name: "Manzanas Golden", quantity: 15, unitPrice: 2.50, unitFormat: 'kg', observations: "Calibre medio" },
      { name: "Plátanos", quantity: 20, unitPrice: 1.75, unitFormat: 'kg', observations: "De Canarias" },
      { name: "Naranjas", quantity: 25, unitPrice: 1.50, unitFormat: 'Cajas', observations: "Para zumo" }
    ],
    estimatedPrice: 675.25
  }
] 