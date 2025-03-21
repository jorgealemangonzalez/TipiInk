import { FC } from 'react'

import { OrderItem } from '@/entities/order/model/types'

interface OrderItemRowProps {
    item: OrderItem
}

export const OrderItemRow: FC<OrderItemRowProps> = ({ item }) => (
    <div className='flex items-start justify-between px-2 py-1'>
        <div className='flex-[2]'>
            <span className='font-medium text-white'>{item.name}</span>
            {item.observations && <div className='mt-0.5 text-sm text-white/70'>({item.observations})</div>}
        </div>
        <span className='flex-1 text-center text-white'>
            {item.quantity} <span className='text-white/70'>({item.unitFormat})</span>
        </span>
        <span className='flex-1 text-right text-white'>{item.unitPrice.toFixed(2)}€</span>
    </div>
)
