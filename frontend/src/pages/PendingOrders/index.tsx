import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { ArrowLeft, Send } from 'lucide-react'

import { MOCK_ORDERS } from '@/entities/order/model/mock'

import { OrderCard } from './ui/OrderCard'

export const PendingOrdersPage: FC = () => {
    const navigate = useNavigate()
    const sortedOrders = [...MOCK_ORDERS].sort(
        (a, b) => a.requestedDeliveryTime.getTime() - b.requestedDeliveryTime.getTime(),
    )

    return (
        <div className='bg-background flex min-h-screen flex-col'>
            <div className='bg-background fixed left-0 right-0 top-0 z-50 shadow-md'>
                <div className='flex items-center justify-between px-4 py-6'>
                    <button
                        onClick={() => navigate(-1)}
                        className='rounded-full p-2 transition-colors hover:bg-white/10'
                    >
                        <ArrowLeft className='h-6 w-6 text-white' />
                    </button>
                    <h1 className='text-xl font-bold text-white'>Pedidos a Enviar</h1>
                    <button className='rounded-full p-2 transition-colors hover:bg-white/10'>
                        <Send className='h-6 w-6 text-white' />
                    </button>
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
