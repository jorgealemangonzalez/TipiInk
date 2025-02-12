import { cn } from "@/shared/lib/utils"
import { Fish, Beef, Apple, Package2, Snowflake, Sparkles } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { SupplierCategory } from "@/entities/order/model/types"
import { SUPPLIERS } from "@/shared/api/mocks/suppliers"

interface SupplierSelectionProps {
  selectedSupplier: string
  onSupplierChange: (supplier: string) => void
  onContinue: () => void
}

const SupplierIcon = ({ type }: { type: SupplierCategory }) => {
  switch (type) {
    case 'pescado':
      return <Fish className="h-6 w-6 text-blue-400" />
    case 'carne':
      return <Beef className="h-6 w-6 text-red-400" />
    case 'frutaVerdura':
      return <Apple className="h-6 w-6 text-green-400" />
    case 'seco':
      return <Package2 className="h-6 w-6 text-amber-400" />
    case 'congelado':
      return <Snowflake className="h-6 w-6 text-slate-300" />
    case 'limpieza':
      return <Sparkles className="h-6 w-6 text-pink-400" />
  }
}

export function SupplierSelection({ 
  selectedSupplier, 
  onSupplierChange, 
  onContinue 
}: SupplierSelectionProps) {
  const handleSupplierClick = (supplier: string) => {
    onSupplierChange(supplier)
    onContinue()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-1">
        {Object.values(SUPPLIERS).map((supplier, index) => (
          <div key={supplier.name}>
            <div
              onClick={() => handleSupplierClick(supplier.name)}
              className="py-4 px-2 flex items-center justify-between hover:bg-gray-700/30 transition-colors cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-white">{supplier.name}</h3>
              <SupplierIcon type={supplier.type} />
            </div>
            {index < Object.values(SUPPLIERS).length - 1 && (
              <Separator className="bg-gray-700/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 