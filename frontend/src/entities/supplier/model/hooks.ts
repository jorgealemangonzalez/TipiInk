import { Supplier } from './types'

const MOCK_SUPPLIERS: Supplier[] = [
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
    },
]

export function useSuppliers() {
    return MOCK_SUPPLIERS
}

export function useSupplier(id: string) {
    return MOCK_SUPPLIERS.find(supplier => supplier.id === id)
}
