import { FC, useState } from 'react'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

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
    onConfirm,
}) => {
    const [selectedReason, setSelectedReason] = useState<string>('')
    const [description, setDescription] = useState('')

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex min-h-screen flex-col bg-background'>
            <div className='flex items-center justify-between border-b border-white/10 p-4'>
                <h2 className='text-xl font-bold text-white'>Tu solicitud al proveedor</h2>
                <button onClick={onClose} className='rounded-full p-2 text-white transition-colors hover:bg-white/10'>
                    <X className='h-6 w-6' />
                </button>
            </div>

            <div className='flex-1 overflow-auto px-4 py-6'>
                <div className='mb-6 rounded-lg bg-white/5 p-4'>
                    <div className='flex items-center gap-4'>
                        <span className='text-2xl font-medium text-white'>{quantity}</span>
                        <div className='flex flex-col'>
                            <span className='font-medium text-white'>{itemName}</span>
                            <span className='text-sm text-white/70'>{unitFormat}</span>
                        </div>
                    </div>
                </div>

                <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className='gap-4'>
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='cantidad'
                            checked={selectedReason.includes('cantidad')}
                            onCheckedChange={checked => {
                                if (checked) {
                                    setSelectedReason(prev => [...prev, 'cantidad'])
                                } else {
                                    setSelectedReason(prev => prev.filter(r => r !== 'cantidad'))
                                }
                            }}
                            className='border-white/20 text-white'
                        />
                        <Label htmlFor='cantidad' className='text-white'>
                            Cantidad incorrecta
                        </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='estado'
                            checked={selectedReason.includes('estado')}
                            onCheckedChange={checked => {
                                if (checked) {
                                    setSelectedReason(prev => [...prev, 'estado'])
                                } else {
                                    setSelectedReason(prev => prev.filter(r => r !== 'estado'))
                                }
                            }}
                            className='border-white/20 text-white'
                        />
                        <Label htmlFor='estado' className='text-white'>
                            Estado incorrecto
                        </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='producto'
                            checked={selectedReason.includes('producto')}
                            onCheckedChange={checked => {
                                if (checked) {
                                    setSelectedReason(prev => [...prev, 'producto'])
                                } else {
                                    setSelectedReason(prev => prev.filter(r => r !== 'producto'))
                                }
                            }}
                            className='border-white/20 text-white'
                        />
                        <Label htmlFor='producto' className='text-white'>
                            Producto incorrecto
                        </Label>
                    </div>
                </RadioGroup>

                <div className='mt-6'>
                    <h3 className='mb-2 text-white'>Problemas encontrados (1)</h3>
                    <div className='rounded-lg bg-white/5 p-4'>
                        <div className='flex items-center justify-between'></div>
                        <div className='mb-4 inline-block rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-500'>
                            {selectedReason === 'cantidad' && 'Cantidad incorrecta'}
                            {selectedReason === 'estado' && 'Estado incorrecto'}
                            {selectedReason === 'producto' && 'Producto incorrecto'}
                        </div>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder='Describe el problema encontrado...'
                            className='border-white/20 bg-transparent text-white placeholder:text-white/50'
                        />
                        <Button onClick={() => {}} variant='outline' className='mt-4 w-full border-white/20 text-white'>
                            Adjuntar imagen
                        </Button>
                    </div>
                </div>
            </div>

            <div className='space-y-3 border-t border-white/10 p-4 pb-8'>
                <Button
                    onClick={() => onConfirm(selectedReason, description)}
                    className='w-full bg-gray-600 text-white hover:bg-gray-700'
                    disabled={!selectedReason || !description}
                >
                    Enviar al proveedor
                </Button>
                <Button
                    onClick={onClose}
                    variant='outline'
                    className='w-full border-white/20 text-white hover:bg-white/10 hover:text-white'
                >
                    Cerrar
                </Button>
            </div>
        </div>
    )
}
