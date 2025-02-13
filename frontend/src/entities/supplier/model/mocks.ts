import { Supplier } from "./types"

export const SUPPLIERS: Record<string, Supplier> = {
  PESCADERIA: {
    id: '1',
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
    id: '2',
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
    id:'3',
    name: 'Carniceria Paco',
    type: 'carne',
    incidents: [],
    deliveryNotes: []
  },
  POLLERIA: {
    id:'4',
    name: 'Polleria Gallo',
    type: 'carne',
    incidents: [],
    deliveryNotes: []
  },
  CHARCUTERIA: {
    id:'5',
    name: 'Charcuteria Delicatessen',
    type: 'carne',
    incidents: [],
    deliveryNotes: []
  },
} 

export const useSuppliers = () => {
  return Object.values(SUPPLIERS)
}

export const useSupplier = (id: string) => {
  return useSuppliers().find(s => s.id === id)!
}