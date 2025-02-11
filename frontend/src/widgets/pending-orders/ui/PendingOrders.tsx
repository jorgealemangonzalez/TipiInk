import { FC } from 'react'
import { OrderCard } from '@/pages/PendingOrders/ui/OrderCard'
import { MOCK_ORDERS } from '@/entities/order/model/mock'
import { useNavigate } from 'react-router-dom'

export const PendingOrders: FC = () => {
  const navigate = useNavigate()
  const sortedOrders = [...MOCK_ORDERS].sort((a, b) => 
    a.requestedDeliveryTime.getTime() - b.requestedDeliveryTime.getTime()
  ).slice(0, 2) // Only show first 2 orders in the widget

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="bg-dark-card-bg rounded-t-[35px] shadow-[0_-1px_20px_rgba(0,0,0,0.25)]">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-primary">Pedidos Pendientes</h2>
          </div>
          <button 
            onClick={() => navigate('/pending-orders')}
            className="text-primary text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Ver Todos
          </button>
        </div>

        {/* Orders List */}
        <div className="pt-4 pb-8">
          <div className="relative space-y-4 px-4">
            {sortedOrders.map((order) => (
              <OrderCard 
                key={order.supplierName} 
                order={order}
                disableDrag
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 