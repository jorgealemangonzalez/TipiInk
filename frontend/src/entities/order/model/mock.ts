import { OrderStatus, PendingOrder } from './types'

export const MOCK_ORDERS: (PendingOrder & { status: OrderStatus })[] = [
    {
        supplierName: 'Prodesco',
        category: 'carne',
        status: 'confirmed',
        requestedDeliveryTime: new Date(2024, 2, 13, 10, 0),
        items: [
            {
                name: 'Solomillo de cerdo',
                quantity: 5,
                unitPrice: 12.5,
                unitFormat: 'kg',
                observations: 'Limpio y cortado',
            },
            { name: 'Pechuga de pollo', quantity: 10, unitPrice: 8.75, unitFormat: 'kg', observations: 'Fileteada' },
            {
                name: 'Costillas de cerdo',
                quantity: 3,
                unitPrice: 15.0,
                unitFormat: 'kg',
                observations: 'Cortadas en tiras',
            },
        ],
        estimatedPrice: 1250.5,
    },
    {
        supplierName: 'Pescadería La Central',
        category: 'pescado',
        status: 'with_delivery_time',
        requestedDeliveryTime: new Date(2024, 2, 14, 11, 30),
        items: [
            {
                name: 'Lubina fresca',
                quantity: 8,
                unitPrice: 22.5,
                unitFormat: 'kg',
                observations: 'Limpia y sin espinas',
            },
            { name: 'Salmón', quantity: 5, unitPrice: 18.75, unitFormat: 'kg', observations: 'En lomos' },
            { name: 'Gambas', quantity: 2, unitPrice: 35.0, unitFormat: 'kg', observations: 'Peladas y cocidas' },
        ],
        estimatedPrice: 850.75,
    },
    {
        supplierName: 'Frutas el Huertano',
        category: 'frutaVerdura',
        status: 'unconfirmed',
        requestedDeliveryTime: new Date(2024, 2, 15, 9, 0),
        items: [
            { name: 'Manzanas Golden', quantity: 15, unitPrice: 2.5, unitFormat: 'kg', observations: 'Calibre medio' },
            { name: 'Plátanos', quantity: 20, unitPrice: 1.75, unitFormat: 'kg', observations: 'De Canarias' },
            { name: 'Naranjas', quantity: 25, unitPrice: 1.5, unitFormat: 'Cajas', observations: 'Para zumo' },
        ],
        estimatedPrice: 675.25,
    },
    {
        supplierName: 'Frutas el Huertano',
        category: 'frutaVerdura',
        status: 'unconfirmed',
        requestedDeliveryTime: new Date(2024, 2, 16, 9, 0),
        items: [
            { name: 'Manzanas Golden', quantity: 15, unitPrice: 2.5, unitFormat: 'kg', observations: 'Calibre medio' },
            { name: 'Plátanos', quantity: 20, unitPrice: 1.75, unitFormat: 'kg', observations: 'De Canarias' },
            { name: 'Naranjas', quantity: 25, unitPrice: 1.5, unitFormat: 'Cajas', observations: 'Para zumo' },
        ],
        estimatedPrice: 675.25,
    },
]
