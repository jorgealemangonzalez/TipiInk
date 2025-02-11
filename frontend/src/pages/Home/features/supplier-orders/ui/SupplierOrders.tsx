import { FC } from 'react'
import { SupplierOrder } from '../model/types'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Mock data - Replace with real data later
const mockOrders: SupplierOrder[] = [
  {
    id: 'JOG45124',
    origin: 'Jakarta Timur',
    destination: 'Yogyakarta',
    status: 'transit',
    orderDate: '6 Dec 2022',
    estimatedDate: '9 Dec 2022',
    products: [],
    total: 0
  },
  {
    id: 'JOG55121',
    origin: 'Jakarta Selatan',
    destination: 'Yogyakarta',
    status: 'delivered',
    orderDate: '5 Dec 2022',
    estimatedDate: '8 Dec 2022',
    products: [],
    total: 0
  },
  {
    id: 'JOG91264',
    origin: 'Depok',
    destination: 'Yogyakarta',
    status: 'delivered',
    orderDate: '5 Dec 2022',
    estimatedDate: '8 Dec 2022',
    products: [],
    total: 0
  }
]

interface OrderCardProps {
  order: SupplierOrder
}

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-[#FF5C35] rounded-2xl p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl font-bold text-white">{order.id}</h3>
        <Badge 
          variant="secondary" 
          className="bg-white/20 text-white hover:bg-white/30"
        >
          {order.status === 'delivered' ? 'Delivered' : 'Transit'}
        </Badge>
      </div>
      <div className="flex items-center text-white/90 text-sm">
        <span>{order.origin}</span>
        <ArrowRight className="w-4 h-4 mx-2" />
        <span>{order.destination}</span>
      </div>
    </div>
  )
}

export const SupplierOrders: FC = () => {
  return (
    <div className="rounded-[35px] shadow-[0_1px_20px_rgba(0,0,0,0.25)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-medium text-primary mb-1">Current Shipping</h2>
          <p className="text-sm text-primary/70">ID {mockOrders[0].id}</p>
        </div>
        <Badge 
          variant="secondary" 
          className="bg-[#FF5C35] text-white hover:bg-[#FF5C35]/90"
        >
          Transit
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-primary/70 mb-2">
          <div>
            <p>{mockOrders[0].orderDate}</p>
            <p>{mockOrders[0].origin}</p>
          </div>
          <div className="text-right">
            <p>Estimated {mockOrders[0].estimatedDate}</p>
            <p>{mockOrders[0].destination}</p>
          </div>
        </div>
        <div className="relative h-1 bg-primary/20 rounded-full">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-[#FF5C35] rounded-full" />
          <div className="absolute left-0 top-0 h-3 w-3 bg-[#FF5C35] rounded-full -translate-y-1" />
          <div className="absolute left-1/3 top-0 h-3 w-3 bg-[#FF5C35] rounded-full -translate-y-1" />
          <div className="absolute right-0 top-0 h-3 w-3 bg-primary/20 rounded-full -translate-y-1" />
        </div>
      </div>

      {/* Recent Shipping */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-primary">Recent Shipping</h3>
          <button className="text-sm text-primary/70 hover:text-primary">See All</button>
        </div>
        <div>
          {mockOrders.slice(1).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
} 