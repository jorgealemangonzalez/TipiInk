import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { MOCK_ORDERS } from '@/entities/order/model/mock'
import { PendingOrder } from '@/entities/order/model/types'
import { cn } from '@/lib/utils'
import { OrderCard } from '@/pages/ActiveOrders/ui/OrderCard'

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
    return (
        <div className='px-6 py-5'>
            <div className='flex items-center gap-3'>
                <h2 className='text-2xl font-bold text-primary'>Pedidos a Recibir</h2>
            </div>
        </div>
    )
}

const OrderListItem: FC<OrderListItemProps> = ({ order, index, collapsed }) => {
    const navigate = useNavigate()
    const collapsedClasses = collapsed
        ? {
              base: 'relative w-full h-[4.5rem]',
              top: `top-[${index * 30}px]`,
              zIndex: `z-[${index * 10}]`,
              shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.35)] rounded-full hover:shadow-[0_8px_16px_rgba(0,0,0,0.45)] transition-shadow duration-200',
          }
        : {}

    return (
        <div
            key={`${order.supplierName}-${order.requestedDeliveryTime}`}
            className={cn(
                'cursor-pointer transition-all duration-300',
                collapsedClasses.base,
                collapsedClasses.top,
                collapsedClasses.zIndex,
                collapsedClasses.shadow,
            )}
            onClick={() => navigate('/active-orders')}
        >
            <OrderCard order={order} disableDrag />
        </div>
    )
}

const OrdersList: FC<{ orders: PendingOrder[]; collapsed?: boolean }> = ({ orders, collapsed }) => (
    <div className='flex h-full flex-col gap-4'>
        <div className='h-full overflow-hidden px-4'>
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
        <div className={cn('h-screen', className)}>
            <div className='h-full rounded-t-[35px] bg-muted shadow-[0_-1px_20px_rgba(0,0,0,0.25)]'>
                <Header />
                <OrdersList orders={sortedOrders} collapsed={collapsed} />
            </div>
        </div>
    )
}

function useSortedOrders() {
    return [...MOCK_ORDERS].sort((a, b) => a.requestedDeliveryTime.getTime() - b.requestedDeliveryTime.getTime())
}
