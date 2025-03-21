import { FC } from 'react'
import { Clock, Phone, ShoppingBag } from 'react-feather'

import { Order } from '../model/types'

interface OrderCardProps {
    order: Order
    onClick: () => void
}

const StatusBadge: FC<{ status: Order['status'] }> = ({ status }) => {
    const statusConfig = {
        confirmed: { text: 'Confirmado', color: 'bg-green-500' },
        unconfirmed: { text: 'Sin confirmar', color: 'bg-orange-500' },
        with_delivery_time: { text: 'Con hora de entrega', color: 'bg-blue-500' },
    }

    const config = statusConfig[status]

    return <span className={`${config.color} rounded-full px-2 py-1 text-sm text-white`}>{config.text}</span>
}

export const OrderCard: FC<OrderCardProps> = ({ order, onClick }) => {
    return (
        <div
            className='bg-main-800 w-full min-w-[300px] max-w-[400px] cursor-pointer rounded-md p-4 hover:opacity-90'
            onClick={onClick}
        >
            <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                    <StatusBadge status={order.status} />
                    {order.deliveryTime && (
                        <div className='text-main-100 flex items-center gap-2'>
                            <Clock className='h-4 w-4' />
                            <span className='text-sm'>{order.deliveryTime}</span>
                        </div>
                    )}
                </div>

                <div className='text-main-100 flex items-center gap-2'>
                    <Phone className='h-4 w-4' />
                    <span className='text-sm'>{order.contactPhone}</span>
                </div>

                <div className='text-main-100 flex items-center gap-2'>
                    <ShoppingBag className='h-4 w-4' />
                    <span className='text-sm'>
                        {order.products.length} {order.products.length === 1 ? 'producto' : 'productos'}
                    </span>
                </div>
            </div>
        </div>
    )
}
