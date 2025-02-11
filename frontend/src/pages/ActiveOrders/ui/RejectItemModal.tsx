import { FC, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface RejectItemModalProps {
  itemName: string
  quantity: number
  unitFormat: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, description: string) => void
}

export const RejectItemModal: FC<RejectItemModalProps> = ({
  itemName,
  quantity,
  unitFormat,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-dark-bg z-50 flex flex-col min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">Tu solicitud al proveedor</h2>
        <button onClick={onClose} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-6">
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-medium text-white">{quantity}</span>
            <div className="flex flex-col">
              <span className="font-medium text-white">{itemName}</span>
              <span className="text-sm text-white/70">{unitFormat}</span>
            </div>
          </div>
        </div>

        <RadioGroup 
          value={selectedReason} 
          onValueChange={setSelectedReason}
          className="gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cantidad" id="cantidad" className="border-white/20 text-white" />
            <Label htmlFor="cantidad" className="text-white">Cantidad incorrecta</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="estado" id="estado" className="border-white/20 text-white" />
            <Label htmlFor="estado" className="text-white">Estado incorrecto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="producto" id="producto" className="border-white/20 text-white" />
            <Label htmlFor="producto" className="text-white">Producto incorrecto</Label>
          </div>
        </RadioGroup>

        <div className="mt-6">
          <h3 className="text-white mb-2">Problemas encontrados (1)</h3>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl text-white">{quantity}</span>
              <span className="text-xl text-white">{itemName}</span>
            </div>
            <div className="inline-block bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm mb-4">
              {selectedReason === 'cantidad' && 'Cantidad incorrecta'}
              {selectedReason === 'estado' && 'Estado incorrecto'}
              {selectedReason === 'producto' && 'Producto incorrecto'}
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el problema encontrado..."
              className="bg-transparent border-white/20 text-white placeholder:text-white/50"
            />
            <Button 
              onClick={() => {}} 
              variant="outline" 
              className="w-full mt-4 border-white/20 text-white"
            >
              Adjuntar imagen
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-8 space-y-3 border-t border-white/10">
        <Button 
          onClick={() => onConfirm(selectedReason, description)}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white"
          disabled={!selectedReason || !description}
        >
          Enviar al proveedor
        </Button>
        <Button 
          onClick={onClose}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          Cerrar
        </Button>
      </div>
    </div>
  )
} 