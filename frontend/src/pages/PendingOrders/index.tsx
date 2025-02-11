import { FC, useState } from 'react'
import { ArrowLeft, Send, Mic, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { motion, useMotionValue, useTransform } from 'framer-motion'

type UnitFormat = 'kg' | 'ud' | 'Lts' | 'Cajas' | 'gr'

interface OrderItem {
  name: string
  quantity: number
  unitPrice: number
  unitFormat: UnitFormat
  observations?: string
}

type SupplierCategory = 'pescado' | 'carne' | 'frutaVerdura' | 'seco' | 'congelado' | 'limpieza'

interface PendingOrder {
  supplierName: string
  category: SupplierCategory
  requestedDeliveryTime: Date
  items: OrderItem[]
  estimatedPrice: number
}

const getCategoryConfig = (category: SupplierCategory) => {
  const configs = {
    pescado: { bg: 'bg-blue-500/15', text: 'text-white' },
    carne: { bg: 'bg-red-500/15', text: 'text-white' },
    frutaVerdura: { bg: 'bg-green-500/15', text: 'text-white' },
    seco: { bg: 'bg-amber-500/15', text: 'text-white' },
    congelado: { bg: 'bg-slate-300/15', text: 'text-white' },
    limpieza: { bg: 'bg-pink-500/15', text: 'text-white' }
  }
  return configs[category]
}

const mockPendingOrders: PendingOrder[] = [
  {
    supplierName: "Prodesco",
    category: 'carne',
    requestedDeliveryTime: new Date(2024, 2, 14, 10, 0), // 14 Mar 10:00
    items: [
      { name: "Solomillo de cerdo", quantity: 5, unitPrice: 12.50, unitFormat: 'kg', observations: "Limpio y cortado" },
      { name: "Pechuga de pollo", quantity: 10, unitPrice: 8.75, unitFormat: 'kg', observations: "Fileteada" },
      { name: "Costillas de cerdo", quantity: 3, unitPrice: 15.00, unitFormat: 'kg', observations: "Cortadas en tiras" }
    ],
    estimatedPrice: 1250.50
  },
  {
    supplierName: "Pescadería La Central",
    category: 'pescado',
    requestedDeliveryTime: new Date(2024, 2, 14, 11, 30), // 14 Mar 11:30
    items: [
      { name: "Lubina fresca", quantity: 8, unitPrice: 22.50, unitFormat: 'kg', observations: "Limpia y sin espinas" },
      { name: "Salmón", quantity: 5, unitPrice: 18.75, unitFormat: 'kg', observations: "En lomos" },
      { name: "Gambas", quantity: 2, unitPrice: 35.00, unitFormat: 'kg', observations: "Peladas y cocidas" }
    ],
    estimatedPrice: 850.75
  },
  {
    supplierName: "Frutas el Huertano",
    category: 'frutaVerdura',
    requestedDeliveryTime: new Date(2024, 2, 14, 9, 0), // 14 Mar 09:00
    items: [
      { name: "Manzanas Golden", quantity: 15, unitPrice: 2.50, unitFormat: 'kg', observations: "Calibre medio" },
      { name: "Plátanos", quantity: 20, unitPrice: 1.75, unitFormat: 'kg', observations: "De Canarias" },
      { name: "Naranjas", quantity: 25, unitPrice: 1.50, unitFormat: 'Cajas', observations: "Para zumo" }
    ],
    estimatedPrice: 675.25
  }
]

const OrderCard: FC<{ order: PendingOrder }> = ({ order }) => {
  const categoryConfig = getCategoryConfig(order.category)
  const formattedDate = format(order.requestedDeliveryTime, "EEE d - HH:mm", { locale: es })
    .replace('lun', 'lun.')
    .replace('mar', 'mar.')
    .replace('mié', 'mié.')
    .replace('jue', 'jue.')
    .replace('vie', 'vie.')
    .replace('sáb', 'sáb.')
    .replace('dom', 'dom.')
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  const x = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)

  // Background opacity for action indicators
  const rightBgOpacity = useTransform(x, [0, 75, 100], [0, 0.5, 1])
  const leftBgOpacity = useTransform(x, [-100, -75, 0], [1, 0.5, 0])

  // Scale for action icons
  const rightIconScale = useTransform(x, [50, 100], [0.8, 1])
  const leftIconScale = useTransform(x, [-100, -50], [1, 0.8])

  // Rotation for icons based on drag
  const rightIconRotate = useTransform(x, [0, 100], [0, 10])
  const leftIconRotate = useTransform(x, [-100, 0], [-10, 0])

  // Card scale and rotation for better feedback
  const cardScale = useTransform(
    x,
    [-100, 0, 100],
    [0.95, 1, 0.95]
  )

  const cardRotate = useTransform(
    x,
    [-100, 0, 100],
    [-3, 0, 3]
  )

  const handleDragEnd = () => {
    setIsDragging(false)
    const xValue = x.get()
    
    if (xValue > 100) {
      // Send order
      console.log('Sending order:', order)
    } else if (xValue < -100) {
      // Edit order with voice assistant
      console.log('Editing order:', order)
    }
  }

  return (
    <div className="relative touch-none">
      {/* Action backgrounds */}
      <motion.div 
        className="absolute inset-0 bg-green-500 rounded-[35px] flex items-center justify-center px-8 pointer-events-none"
        style={{ opacity: rightBgOpacity }}
      >
        <motion.div 
          style={{ scale: rightIconScale, rotate: rightIconRotate }}
          className="flex flex-col items-center gap-1"
        >
          <Send className="w-8 h-8 text-white" />
          <span className="text-sm text-white font-medium">Enviar</span>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 bg-blue-500 rounded-[35px] flex items-center justify-center px-8 pointer-events-none"
        style={{ opacity: leftBgOpacity }}
      >
        <motion.div 
          style={{ scale: leftIconScale, rotate: leftIconRotate }}
          className="flex flex-col items-center gap-1"
        >
          <Mic className="w-8 h-8 text-white" />
          <span className="text-sm text-white font-medium">Editar</span>
        </motion.div>
      </motion.div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x, scale: cardScale, rotate: cardRotate }}
        whileTap={{ cursor: 'grabbing' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="touch-none"
      >
        <Card className={cn(
          "border-none rounded-[35px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] select-none",
          categoryConfig.bg,
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}>
          <div className="p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-white">{order.supplierName}</span>
              <span className="px-3 py-1.5 rounded-full font-medium bg-white text-black">
                {capitalizedDate}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {/* List Header */}
              <div className="flex justify-between items-center text-sm text-white/70 px-2">
                <span className="flex-[2]">Artículo</span>
                <span className="flex-1 text-center">Cantidad</span>
                <span className="flex-1 text-right">Precio/ud.</span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start px-2 py-1">
                    <div className="flex-[2]">
                      <span className="font-medium text-white">{item.name}</span>
                      {item.observations && (
                        <div className="text-sm text-white/70 mt-0.5">
                          ({item.observations})
                        </div>
                      )}
                    </div>
                    <span className="flex-1 text-center text-white">
                      {item.quantity} <span className="text-white/70">({item.unitFormat})</span>
                    </span>
                    <span className="flex-1 text-right text-white">{item.unitPrice.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center mr-2 pt-2 border-t border-white/20">
              <span className="text-lg font-medium text-white">{order.estimatedPrice}€</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export const PendingOrders: FC = () => {
  const navigate = useNavigate()

  const sortedOrders = [...mockPendingOrders].sort((a, b) => 
    a.requestedDeliveryTime.getTime() - b.requestedDeliveryTime.getTime()
  )

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 shadow-md bg-dark-bg z-50">
        <div className="flex justify-between items-center px-4 py-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Pedidos Pendientes</h1>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Orders List Container */}
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