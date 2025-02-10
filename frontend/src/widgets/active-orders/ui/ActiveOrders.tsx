import { FC, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

interface Order {
  id: string
  status: 'pending' | 'delivered' | 'in_progress'
  customerName: string
  details: string
  date: string
}

// Mock data for development
const mockOrders: Order[] = [
  {
    id: 'PED001',
    status: 'pending',
    customerName: 'Restaurante ABC',
    details: '2 Cajas de Verduras',
    date: '12 Mar 2024'
  },
  {
    id: 'PED002',
    status: 'in_progress',
    customerName: 'Bar XYZ',
    details: '5 kg Pescado',
    date: '12 Mar 2024'
  },
  {
    id: 'PED003',
    status: 'delivered',
    customerName: 'Cafetería 123',
    details: '10 kg Carne',
    date: '11 Mar 2024'
  }
]

const OrderStatusBadge: FC<{ status: Order['status'] }> = ({ status }) => {
  const config = {
    pending: { text: 'Pendiente', color: 'bg-orange-500' },
    in_progress: { text: 'En Proceso', color: 'bg-blue-500' },
    delivered: { text: 'Entregado', color: 'bg-green-500' }
  }[status]

  return (
    <span className={`${config.color} px-2 py-1 rounded-full text-xs text-white`}>
      {config.text}
    </span>
  )
}

export const ActiveOrders: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-main-900 rounded-t-3xl shadow-lg transition-all duration-300"
         style={{ 
           maxHeight: isExpanded ? '80vh' : '40vh',
           transform: `translateY(${isExpanded ? '0' : '50%'})`
         }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-main-800">
        <h2 className="text-lg font-semibold text-white">Pedidos Activos</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-main-800 rounded-full transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-6 h-6 text-main-400" />
          ) : (
            <ChevronUp className="w-6 h-6 text-main-400" />
          )}
        </button>
      </div>

      {/* Orders List */}
      <div className="overflow-y-auto h-full">
        <div className="p-4 space-y-3">
          {mockOrders.map(order => (
            <div
              key={order.id}
              className="bg-main-800 p-4 rounded-xl flex items-center justify-between hover:bg-main-700 transition-colors cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{order.customerName}</span>
                  <span className="text-sm text-main-300">#{order.id}</span>
                </div>
                <p className="text-sm text-main-300">{order.details}</p>
                <p className="text-xs text-main-400">{order.date}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 