import { Timestamp } from 'firebase/firestore'

import { Supplier } from '@tipi/shared'

// Definimos un tipo parcial compatible con nuestros mocks
// Omitimos el id de SupplierDBModel ya que lo añadiremos manualmente
type SupplierMock = Omit<Supplier, 'createdAt' | 'updatedAt'> & {
    createdAt: Timestamp
    updatedAt: Timestamp
}

// export const SUPPLIERS: Record<string, Supplier> = {
//     PESCADERIA: {
//         id: '1',
//         name: 'Pescaderia La Central',
//         type: 'pescaderia',
//         incidents: [
//             {
//                 id: 'INC-001',
//                 description: 'Albarán ALB-2024-089 pendiente de recibir',
//                 date: '2024-03-20',
//                 status: 'pending',
//                 type: 'albaran_missing',
//             },
//             {
//                 id: 'INC-002',
//                 description: 'Pendiente de cambio de importe en albarán ALB-2024-092',
//                 date: '2024-03-21',
//                 status: 'resolved',
//                 type: 'amount_correction',
//             },
//         ],
//         deliveryNotes: [
//             { id: 'ALB-2024-089', date: '2024-03-15', total: 1250.5, hasIncidents: true },
//             { id: 'ALB-2024-092', date: '2024-03-16', total: 875.25, hasIncidents: false },
//         ],
//     },
//     FRUTERIA: {
//         id: '2',
//         name: 'Fruteria Huertano',
//         type: 'fruteria',
//         incidents: [
//             {
//                 id: 'INC-003',
//                 description: 'Pendiente de acordar compensación por deficiencia en entrega ALB-2024-095',
//                 date: '2024-03-22',
//                 status: 'pending',
//                 type: 'delivery_compensation',
//             },
//         ],
//         deliveryNotes: [{ id: 'ALB-2024-095', date: '2024-03-17', total: 1420.75, hasIncidents: true }],
//     },
//     CARNICERIA: {
//         id: '3',
//         name: 'Carniceria Paco',
//         type: 'carniceria',
//         incidents: [],
//         deliveryNotes: [],
//     },
//     POLLERIA: {
//         id: '4',
//         name: 'Polleria Gallo',
//         type: 'carniceria',
//         incidents: [],
//         deliveryNotes: [],
//     },
//     CHARCUTERIA: {
//         id: '5',
//         name: 'Charcuteria Delicatessen',
//         type: 'carniceria',
//         incidents: [],
//         deliveryNotes: [],
//     },
// }

// Creamos mocks con el tipo correcto
export const SUPPLIERS: SupplierMock[] = [
    {
        id: '1',
        name: 'Pescaderia La Central',
        type: 'pescaderia',
        totalOrders: 156,
        lastMonthInvoiced: 12500,
        pendingIncidents: 2,
        commercialPhone: '916666666',
        deliveryPhone: '666999000',
        deliveryDays: ['Lunes', 'Miércoles', 'Viernes'],
        orderAdvanceHours: 24,
        invoices: [
            { id: 'INV-001', date: '2024-03-15', total: 2500, status: 'paid', pdfUrl: '#' },
            { id: 'INV-002', date: '2024-03-01', total: 3200, status: 'paid', pdfUrl: '#' },
            { id: 'INV-003', date: '2024-02-15', total: 2800, status: 'paid', pdfUrl: '#' },
        ],
        deliveryNotes: [
            {
                id: 'ALB-001',
                date: '2024-03-20',
                total: 850,
                hasIncidents: true,
                incidentDetails: {
                    description: 'Producto en mal estado',
                    affectedItems: ['Lubina - 2kg', 'Mejillones - 1kg'],
                    reportDate: '2024-03-20',
                    status: 'pending',
                },
            },
            { id: 'ALB-002', date: '2024-03-18', total: 1200, hasIncidents: false },
            { id: 'ALB-003', date: '2024-03-15', total: 950, hasIncidents: false, invoiceId: 'INV-001' },
        ],
        createdAt: Timestamp.fromDate(new Date('2024-01-01')),
        updatedAt: Timestamp.fromDate(new Date('2024-03-01')),
    },
    {
        id: '2',
        name: 'Fruteria El Huertano',
        type: 'fruteria',
        totalOrders: 89,
        lastMonthInvoiced: 8900,
        pendingIncidents: 0,
        commercialPhone: '916777777',
        deliveryPhone: '666888000',
        deliveryDays: ['Martes', 'Jueves', 'Sábado'],
        orderAdvanceHours: 48,
        invoices: [
            { id: 'INV-001', date: '2024-03-10', total: 1800, status: 'paid', pdfUrl: '#' },
            { id: 'INV-002', date: '2024-02-25', total: 2100, status: 'paid', pdfUrl: '#' },
        ],
        deliveryNotes: [
            { id: 'ALB-001', date: '2024-03-12', total: 950, hasIncidents: false, invoiceId: 'INV-001' },
            { id: 'ALB-002', date: '2024-02-27', total: 1150, hasIncidents: false, invoiceId: 'INV-002' },
        ],
        createdAt: Timestamp.fromDate(new Date('2024-01-15')),
        updatedAt: Timestamp.fromDate(new Date('2024-03-05')),
    },
    {
        id: '3',
        name: 'Carniceria Paco',
        type: 'carniceria',
        totalOrders: 123,
        lastMonthInvoiced: 15600,
        pendingIncidents: 1,
        commercialPhone: '916888888',
        deliveryPhone: '666777000',
        deliveryDays: ['Lunes', 'Miércoles', 'Viernes'],
        orderAdvanceHours: 24,
        invoices: [
            { id: 'INV-001', date: '2024-03-18', total: 3500, status: 'paid', pdfUrl: '#' },
            { id: 'INV-002', date: '2024-03-04', total: 4200, status: 'paid', pdfUrl: '#' },
        ],
        deliveryNotes: [
            {
                id: 'ALB-001',
                date: '2024-03-20',
                total: 1200,
                hasIncidents: true,
                incidentDetails: {
                    description: 'Retraso en la entrega',
                    affectedItems: ['Pedido completo'],
                    reportDate: '2024-03-20',
                    status: 'pending',
                },
            },
            { id: 'ALB-002', date: '2024-03-19', total: 2300, hasIncidents: false, invoiceId: 'INV-001' },
        ],
        createdAt: Timestamp.fromDate(new Date('2024-02-01')),
        updatedAt: Timestamp.fromDate(new Date('2024-03-10')),
    },
]
