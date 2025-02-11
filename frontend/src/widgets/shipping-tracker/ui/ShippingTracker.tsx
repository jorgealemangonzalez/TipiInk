import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface ShippingTrackerProps {
  supplierName: string
  category: string
  commercialName: string
  deliveryDate: string
  totalItems: number
  estimatedPrice: number
  currentCard: number
  totalCards: number
  className?: string
}

export function ShippingTracker({
  supplierName,
  category,
  commercialName,
  deliveryDate,
  totalItems,
  estimatedPrice,
  currentCard,
  totalCards,
  className
}: ShippingTrackerProps) {
  const navigate = useNavigate()

  return (
    <div 
      className={cn("rounded-[35px] overflow-hidden cursor-pointer transition-transform hover:scale-[0.99]", className)}
      onClick={() => navigate('/pending-orders')}
    >
      <Card className="bg-[#1C1C1E] shadow-[0_4px_20px_rgba(0,0,0,0.25)] border-none">
        <div className="flex flex-col gap-3 p-6">
          {/* Header section */}
          <h2 className="text-xl font-medium text-white">Pedidos pendientes de lanzar</h2>

          {/* Supplier Name and Category */}
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
              {supplierName}
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FF9F66] text-white text-sm font-medium">
              {category}
            </span>
          </div>

          {/* Details section */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Fecha de entrega:</span>
                <span className="font-medium text-white">{deliveryDate}</span>
              </div>
              <span className="font-medium text-white mt-1">{commercialName}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Artículos totales:</span>
                <span className="font-medium text-white">{totalItems}</span>
              </div>
              <span className="font-medium text-white mt-1">{estimatedPrice}€</span>
            </div>
          </div>
          
          {/* Card navigation dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalCards }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentCard - 1 
                    ? "bg-[#FF9F66] w-4" 
                    : "bg-[#2C2C2E]"
                )}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
} 