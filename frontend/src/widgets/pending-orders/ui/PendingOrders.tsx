import { FC } from 'react'
import { OrderCard } from '@/pages/PendingOrders/ui/OrderCard'
import { MOCK_ORDERS } from '@/entities/order/model/mock'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface PendingOrdersProps {
  className?: string
  collapsed?: boolean
}

export const PendingOrders: FC<PendingOrdersProps> = ({ className, collapsed = false }) => {
  const navigate = useNavigate()
  const sortedOrders = [...MOCK_ORDERS].sort((a, b) => 
    a.requestedDeliveryTime.getTime() - b.requestedDeliveryTime.getTime()
  )

  return (
    <div className={cn("h-screen", className)}>
      <div className="h-full bg-dark-card-bg rounded-t-[35px] shadow-[0_-1px_20px_rgba(0,0,0,0.25)]">
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
        <div className="flex flex-col gap-4 h-full">
          <div className="px-4 h-full overflow-hidden">
            {sortedOrders.map((order, index) => (
              <div 
                key={order.supplierName+order.requestedDeliveryTime}
                className={cn(
                  'transition-all duration-300',
                  collapsed && 'relative w-full h-[4.5rem]',
                  collapsed && index > 0 && `top-[${index * 30}px]`,
                  collapsed && `z-[${index*10}]`
                )}
              >
                <OrderCard 
                  order={order}
                  disableDrag
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 