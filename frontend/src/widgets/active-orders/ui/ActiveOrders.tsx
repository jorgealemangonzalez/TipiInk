import { FC } from 'react'
import { OrderCard } from '@/pages/ActiveOrders/ui/OrderCard'
import { MOCK_ORDERS } from '@/entities/order/model/mock'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { PendingOrder } from '@/entities/order/model/types'

interface ActiveOrdersProps {
  className?: string
  collapsed?: boolean
}

interface OrderListItemProps {
  order: PendingOrder
  index: number
  collapsed?: boolean
}

const Header: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-primary">Pedidos Activos</h2>
      </div>
      <button 
        onClick={() => navigate('/active-orders')}
        className="text-primary text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Ver Todos
      </button>
    </div>
  )
}

const OrderListItem: FC<OrderListItemProps> = ({ order, index, collapsed }) => {
  const collapsedClasses = collapsed ? {
    base: 'relative w-full h-[4.5rem]',
    top: `top-[${index * 30}px]`,
    zIndex: `z-[${index * 10}]`
  } : {}

  return (
    <div 
      key={`${order.supplierName}-${order.requestedDeliveryTime}`}
      className={cn(
        'transition-all duration-300',
        collapsedClasses.base,
        collapsedClasses.top,
        collapsedClasses.zIndex
      )}
    >
      <OrderCard 
        order={order}
        disableDrag
      />
    </div>
  )
}

const OrdersList: FC<{ orders: PendingOrder[], collapsed?: boolean }> = ({ orders, collapsed }) => (
  <div className="flex flex-col gap-4 h-full">
    <div className="px-4 h-full overflow-hidden">
      {orders.map((order, index) => (
        <OrderListItem 
          key={`${order.supplierName}-${order.requestedDeliveryTime}`}
          order={order}
          index={index}
          collapsed={collapsed}
        />
      ))}
    </div>
  </div>
)

export const ActiveOrders: FC<ActiveOrdersProps> = ({ className, collapsed = false }) => {
  const sortedOrders = useSortedOrders()

  return (
    <div className={cn("h-screen", className)}>
      <div className="h-full bg-dark-card-bg rounded-t-[35px] shadow-[0_-1px_20px_rgba(0,0,0,0.25)]">
        <Header />
        <OrdersList orders={sortedOrders} collapsed={collapsed} />
      </div>
    </div>
  )
}

function useSortedOrders() {
  return [...MOCK_ORDERS].sort((a, b) => 
    a.requestedDeliveryTime.getTime() - b.requestedDeliveryTime.getTime()
  )
} 