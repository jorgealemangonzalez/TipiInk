import { useNavigate } from "react-router-dom"
import { BackButton } from "@/shared/ui/back-button"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, Beef, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Supplier } from "@/entities/supplier/model/types"

// Mock data - Replace with real data later
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Pescaderia La Central",
    type: "pescaderia",
    totalOrders: 156,
    lastMonthInvoiced: 12500,
    pendingIncidents: 2,
    phone: "916666666"
  },
  {
    id: "2",
    name: "Fruteria El Huertano",
    type: "fruteria",
    totalOrders: 89,
    lastMonthInvoiced: 8900,
    pendingIncidents: 0,
    phone: "916666666"
  },
  {
    id: "3",
    name: "Carniceria Paco",
    type: "carniceria",
    totalOrders: 123,
    lastMonthInvoiced: 15600,
    pendingIncidents: 1,
    phone: "916666666"
  }
]

const SupplierIcon = ({ type }: { type: Supplier["type"] }) => {
  switch (type) {
    case "pescaderia":
      return <Package className="w-6 h-6 text-blue-400" />
    case "fruteria":
      return <Truck className="w-6 h-6 text-green-400" />
    case "carniceria":
      return <Beef className="w-6 h-6 text-red-400" />
  }
}

export function SupplierManagementPage() {
  const navigate = useNavigate()

  const handleSupplierClick = (supplierId: string) => {
    navigate(`/supplier-management/${supplierId}`)
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 flex items-center relative">
        <BackButton className="absolute left-4" />
        <h1 className="text-xl font-bold text-white w-full text-center">Gestión de Proveedores</h1>
      </div>
      
      <div className="max-w-3xl px-6">
        <div className="space-y-1">
          {mockSuppliers.map((supplier, index) => (
            <div key={supplier.id}>
              <div
                onClick={() => handleSupplierClick(supplier.id)}
                className="py-4 px-2 flex items-center justify-between hover:bg-gray-700/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <SupplierIcon type={supplier.type} />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{supplier.name}</h3>
                    <p className="text-sm text-gray-400">
                      {supplier.pendingIncidents} incidencias pendientes
                    </p>
                  </div>
                </div>
                <Button 
                  variant="link" 
                  size="icon"
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Add phone call functionality here
                    window.open(`tel:${supplier.phone}`, '_blank')
                  }}
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
              {index < mockSuppliers.length - 1 && (
                <Separator className="bg-gray-700/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 