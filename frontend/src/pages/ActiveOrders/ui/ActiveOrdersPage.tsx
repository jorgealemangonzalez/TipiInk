import { FC } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MOCK_ORDERS } from '@/entities/order/model/mock'
import { OrderCard } from './OrderCard'

export const ActiveOrdersPage: FC = () => {
  const navigate = useNavigate()
  const sortedOrders = [...MOCK_ORDERS].sort((a, b) => 
    a.requestedDeliveryTime.getTime() - b.requestedDeliveryTime.getTime()
  )

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      <div className="fixed top-0 left-0 right-0 shadow-md bg-dark-bg z-50">
        <div className="flex justify-between items-center px-4 py-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Pedidos Activos</h1>
          <div className="w-10" /> {/* Spacer to maintain header centering */}
        </div>
      </div>

      <div className="flex-1 px-4 pt-6 mt-[88px] pb-8 overflow-hidden">
        <div className="space-y-4 relative">
          {sortedOrders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
} 