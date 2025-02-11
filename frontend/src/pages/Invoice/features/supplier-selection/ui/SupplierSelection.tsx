import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SUPPLIERS = {
  PESCADERIA: 'Pescaderia La Central',
  FRUTERIA: 'Fruteria El Huertano',
  CARNICERIA: 'Carniceria Paco'
} as const

interface SupplierSelectionProps {
  selectedSupplier: string
  onSupplierChange: (supplier: string) => void
  onContinue: () => void
}

export function SupplierSelection({ 
  selectedSupplier, 
  onSupplierChange, 
  onContinue 
}: SupplierSelectionProps) {
  return (
    <Card className="border border-white/40 bg-transparent shadow-none p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Seleccionar Proveedor</h2>
      <p className="text-gray-400 mb-6">
        Selecciona el proveedor para asociar los albaranes correspondientes a la factura
      </p>
      <div className="space-y-4">
        <Select
          value={selectedSupplier}
          onValueChange={onSupplierChange}
        >
          <SelectTrigger className="border-white/40 bg-transparent text-white">
            <SelectValue placeholder="Selecciona un proveedor" />
          </SelectTrigger>
          <SelectContent className="bg-[#1c474f] border-white/40">
            <SelectItem value={SUPPLIERS.PESCADERIA} className="text-white hover:bg-white/10">
              {SUPPLIERS.PESCADERIA}
            </SelectItem>
            <SelectItem value={SUPPLIERS.FRUTERIA} className="text-white hover:bg-white/10">
              {SUPPLIERS.FRUTERIA}
            </SelectItem>
            <SelectItem value={SUPPLIERS.CARNICERIA} className="text-white hover:bg-white/10">
              {SUPPLIERS.CARNICERIA}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button 
          className="w-full bg-white hover:bg-white/90 text-black transition-colors"
          onClick={onContinue}
          disabled={!selectedSupplier}
        >
          Continuar
        </Button>
      </div>
    </Card>
  )
} 