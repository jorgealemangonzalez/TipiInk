import { FC } from 'react'
import { SupplierOrder } from '../model/types'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SUPPLIERS = {
  PESCADERIA: 'Pescaderia La Central',
  FRUTERIA: 'Fruteria El Huertano',
  CARNICERIA: 'Carniceria Paco'
} as const

type Supplier = typeof SUPPLIERS[keyof typeof SUPPLIERS]

// Mock data - Replace with real data later
const mockOrders: SupplierOrder[] = [
  {
    id: 'PED-001',
    origin: SUPPLIERS.PESCADERIA,
    destination: 'Almacén Central',
    status: 'transit',
    orderDate: '20 Mar 2024',
    estimatedDate: '21 Mar 2024',
    products: [],
    total: 0
  },
  {
    id: 'PED-002',
    origin: SUPPLIERS.FRUTERIA,
    destination: 'Almacén Central',
    status: 'delivered',
    orderDate: '19 Mar 2024',
    estimatedDate: '20 Mar 2024',
    products: [],
    total: 0
  },
  {
    id: 'PED-003',
    origin: SUPPLIERS.CARNICERIA,
    destination: 'Almacén Central',
    status: 'delivered',
    orderDate: '18 Mar 2024',
    estimatedDate: '19 Mar 2024',
    products: [],
    total: 0
  }
]

interface OrderCardProps {
  order: SupplierOrder
}

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  return (
    <Card className="border border-border/40 bg-transparent mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-primary">{order.id}</h3>
          <Badge 
            variant="outline" 
            className="border-primary/40 text-primary"
          >
            {order.status === 'delivered' ? 'Entregado' : 'En Tránsito'}
          </Badge>
        </div>
        <div className="flex items-center text-primary/70 text-sm">
          <span>{order.origin}</span>
          <ArrowRight className="w-4 h-4 mx-2" />
          <span>{order.destination}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export const SupplierOrders: FC = () => {
  return (
    <Card className="border border-border/40 bg-transparent shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-medium text-primary mb-4">Seleccionar Proveedor</CardTitle>
            <Select>
              <SelectTrigger className="w-[280px] bg-transparent border-border/40">
                <SelectValue placeholder="Selecciona un proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SUPPLIERS.PESCADERIA}>{SUPPLIERS.PESCADERIA}</SelectItem>
                <SelectItem value={SUPPLIERS.FRUTERIA}>{SUPPLIERS.FRUTERIA}</SelectItem>
                <SelectItem value={SUPPLIERS.CARNICERIA}>{SUPPLIERS.CARNICERIA}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge 
            variant="outline"
            className="border-primary/40 text-primary"
          >
            En Tránsito
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-primary/70 mb-2">
            <div>
              <p>{mockOrders[0].orderDate}</p>
              <p>{mockOrders[0].origin}</p>
            </div>
            <div className="text-right">
              <p>Estimado: {mockOrders[0].estimatedDate}</p>
              <p>{mockOrders[0].destination}</p>
            </div>
          </div>
          <div className="relative h-1 bg-primary/20 rounded-full">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-primary/40 rounded-full" />
            <div className="absolute left-0 top-0 h-3 w-3 bg-primary rounded-full -translate-y-1" />
            <div className="absolute left-1/3 top-0 h-3 w-3 bg-primary rounded-full -translate-y-1" />
            <div className="absolute right-0 top-0 h-3 w-3 bg-primary/20 rounded-full -translate-y-1" />
          </div>
        </div>

        {/* Recent Shipping */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-primary">Pedidos Recientes</h3>
            <button className="text-sm text-primary/70 hover:text-primary">Ver Todos</button>
          </div>
          <div>
            {mockOrders.slice(1).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 