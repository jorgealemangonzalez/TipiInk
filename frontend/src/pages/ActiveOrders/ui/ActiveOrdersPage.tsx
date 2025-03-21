import { FC } from 'react'

import { MOCK_ORDERS } from '@/entities/order/model/mock'
import { BackButton } from '@/shared/ui/back-button'

import { OrderCard } from './OrderCard'

export const ActiveOrdersPage: FC = () => {
    const sortedOrders = [...MOCK_ORDERS].sort(
        (a, b) => a.requestedDeliveryTime.getTime() - b.requestedDeliveryTime.getTime(),
    )

    return (
        <div className='flex min-h-screen flex-col bg-background'>
            <div className='fixed left-0 right-0 top-0 z-50 bg-background shadow-md'>
                <div className='flex items-center justify-between px-4 py-6'>
                    <BackButton />
                    <h1 className='text-xl font-bold text-white'>Pedidos a Recibir</h1>
                    <div className='w-10' /> {/* Spacer to maintain header centering */}
                </div>
            </div>

            <div className='mt-[88px] flex-1 overflow-hidden px-4 pb-8 pt-6'>
                <div className='relative space-y-4'>
                    {sortedOrders.map((order, index) => (
                        <OrderCard key={index} order={order} />
                    ))}
                </div>
            </div>
        </div>
    )
}
