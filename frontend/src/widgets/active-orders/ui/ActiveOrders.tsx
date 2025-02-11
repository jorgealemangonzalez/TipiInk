import React, { FC, useState, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

interface Order {
  id: string
  supplier: string
  orderDate: string
  status: 'confirmed' | 'with_delivery_time' | 'delivered'
  deliveryTime?: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    supplier: 'Prodesco',
    orderDate: '12 Mar',
    status: 'confirmed'
  },
  {
    id: '2',
    supplier: 'Pescadería La Central',
    orderDate: '12 Mar',
    status: 'with_delivery_time',
    deliveryTime: '13 Mar'
  },
  {
    id: '3',
    supplier: 'Frutas el Huertano',
    orderDate: '12 Mar',
    status: 'delivered'
  }
]

const OrderCard: FC<{ order: Order; index: number; total: number }> = ({ order, index, total }) => {
  const getGradient = (index: number, total: number) => {
    const colors = [
      '#FF5C35',
      '#FF6642',
      '#FF7452'
    ]
    return {
      background: colors[index],
      boxShadow: `0px ${4 + (index * 2)}px ${8 + (index * 4)}px rgba(0, 0, 0, 0.25)`
    }
  }

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      confirmed: {
        text: 'Confirmado',
        color: 'bg-green-500',
        textColor: 'text-green-500'
      },
      with_delivery_time: {
        text: 'Hora de entrega',
        color: 'bg-blue-500',
        textColor: 'text-blue-500'
      },
      delivered: {
        text: 'Pendiente',
        color: 'bg-gray-500',
        textColor: 'text-gray-500'
      }
    }
    return configs[status]
  }

  const style = getGradient(index, total)
  const statusConfig = getStatusConfig(order.status)

  return (
    <div className="relative w-[calc(100%-32px)] mx-auto" style={{
      marginTop: index > 0 ? '-65px' : '0',
      zIndex: index + 1,
    }}>
      <div
        style={{
          ...style,
          transition: 'all 0.3s ease'
        }}
        className="rounded-[35px] relative min-h-[140px] backdrop-blur-sm"
      >
        {/* Status Chip */}
        <div className="absolute top-3 right-3">
          <span className={`bg-white px-3 py-1 rounded-full text-xs font-medium ${statusConfig.textColor}`}>
            {statusConfig.text}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 pt-8">
          <h3 className="text-[32px] font-bold text-primary leading-tight mb-4">{order.supplier}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <span className="text-primary/90 text-sm font-medium min-w-[70px]">Pedido:</span>
              <span className="text-primary text-base">{order.orderDate}</span>
            </div>
            <div className="flex items-center">
              <span className="text-primary/90 text-sm font-medium min-w-[70px]">Entrega:</span>
              <span className="text-primary text-base">{order.deliveryTime || 'Pendiente'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ActiveOrders: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0"
    >
      <div className="bg-dark-card-bg rounded-t-[35px] shadow-[0_-1px_20px_rgba(0,0,0,0.25)]">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-primary">Pedidos Activos</h2>
          </div>
          <button 
            className="text-primary text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Ver Todos
          </button>
        </div>

        {/* Orders List */}
        <div className="pt-4 pb-8">
          <div className="relative">
            {mockOrders.map((order, index) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                index={index}
                total={mockOrders.length}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 