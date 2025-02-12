import { SupplierCategory } from "@/entities/order/model/types"

interface Incident {
  id: string
  description: string
  date: string
  status: "pending" | "resolved"
  type: "albaran_missing" | "amount_correction" | "delivery_compensation"
}

interface DeliveryNote {
  id: string
  date: string
  total: number
}

interface Supplier {
  name: string
  type: SupplierCategory
  incidents: Incident[]
  deliveryNotes: DeliveryNote[]
}

export const SUPPLIERS: Record<string, Supplier> = {
  PESCADERIA: {
    name: 'Pescaderia La Central',
    type: 'pescado',
    incidents: [
      {
        id: "INC-001",
        description: "Albarán ALB-2024-089 pendiente de recibir",
        date: "2024-03-20",
        status: "pending",
        type: "albaran_missing"
      },
      {
        id: "INC-002",
        description: "Pendiente de cambio de importe en albarán ALB-2024-092",
        date: "2024-03-21",
        status: "resolved",
        type: "amount_correction"
      }
    ],
    deliveryNotes: [
      { id: "ALB-2024-089", date: "2024-03-15", total: 1250.50 },
      { id: "ALB-2024-092", date: "2024-03-16", total: 875.25 }
    ]
  },
  FRUTERIA: {
    name: 'Fruteria Huertano',
    type: 'frutaVerdura',
    incidents: [
      {
        id: "INC-003",
        description: "Pendiente de acordar compensación por deficiencia en entrega ALB-2024-095",
        date: "2024-03-22",
        status: "pending",
        type: "delivery_compensation"
      }
    ],
    deliveryNotes: [
      { id: "ALB-2024-095", date: "2024-03-17", total: 1420.75 }
    ]
  },
  CARNICERIA: {
    name: 'Carniceria Paco',
    type: 'carne',
    incidents: [],
    deliveryNotes: []
  },
  POLLERIA: {
    name: 'Polleria Gallo',
    type: 'carne',
    incidents: [],
    deliveryNotes: []
  },
  CHARCUTERIA: {
    name: 'Charcuteria Delicatessen',
    type: 'carne',
    incidents: [],
    deliveryNotes: []
  },
  CONGELADOS: {
    name: 'Congelados Polar',
    type: 'congelado',
    incidents: [],
    deliveryNotes: []
  },
  BEBIDAS: {
    name: 'Distribuidora de Bebidas',
    type: 'seco',
    incidents: [],
    deliveryNotes: []
  },
  CONSERVAS: {
    name: 'Conservas del Cantábrico',
    type: 'seco',
    incidents: [],
    deliveryNotes: []
  },
  LACTEOS: {
    name: 'Lácteos La Vaquita',
    type: 'seco',
    incidents: [],
    deliveryNotes: []
  },
  LIMPIEZA: {
    name: 'Productos de Limpieza Clean',
    type: 'limpieza',
    incidents: [],
    deliveryNotes: []
  },
  SECOS: {
    name: 'Alimentos Secos y Legumbres',
    type: 'seco',
    incidents: [],
    deliveryNotes: []
  },
  VERDULERIA: {
    name: 'Verduleria Huerta Fresca',
    type: 'frutaVerdura',
    incidents: [],
    deliveryNotes: []
  }
} 