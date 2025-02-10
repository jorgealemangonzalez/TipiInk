import { FC } from 'react'
import { Order } from '../model/types'
import { Clock, Phone, ShoppingBag } from 'react-feather'

interface OrderCardProps {
  order: Order
  onClick: () => void
}

const StatusBadge: FC<{ status: Order['status'] }> = ({ status }) => {
  const statusConfig = {
    confirmed: { text: 'Confirmado', color: 'bg-green-500' },
    unconfirmed: { text: 'Sin confirmar', color: 'bg-orange-500' },
    with_delivery_time: { text: 'Con hora de entrega', color: 'bg-blue-500' }
  }

  const config = statusConfig[status]

  return (
    <span className={`${config.color} px-2 py-1 rounded-full text-sm text-white`}>
      {config.text}
    </span>
  )
}

export const OrderCard: FC<OrderCardProps> = ({ order, onClick }) => {
  return (
    <div
      className="bg-main-800 p-4 rounded-md cursor-pointer hover:opacity-90 min-w-[300px] max-w-[400px] w-full"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <StatusBadge status={order.status} />
          {order.deliveryTime && (
            <div className="flex items-center gap-2 text-main-100">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{order.deliveryTime}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-main-100">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{order.contactPhone}</span>
        </div>

        <div className="flex items-center gap-2 text-main-100">
          <ShoppingBag className="w-4 h-4" />
          <span className="text-sm">
            {order.products.length} {order.products.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>
      </div>
    </div>
  )
} 