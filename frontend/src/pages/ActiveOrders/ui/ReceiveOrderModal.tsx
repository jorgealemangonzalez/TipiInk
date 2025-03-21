import { FC, useState } from 'react'

import { AlertCircle, Check, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PendingOrder } from '@/entities/order/model/types'

interface ReceiveOrderModalProps {
    order: PendingOrder
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

interface OrderItemValidationProps {
    quantity: number
    name: string
    unitFormat: string
    isValidated?: boolean | null
    onValidate: (isValid: boolean) => void
}

type ReceiveStep = 'validation' | 'upload' | 'confirmation' | 'assistant'

const OrderItemValidation: FC<OrderItemValidationProps> = ({ quantity, name, unitFormat, isValidated, onValidate }) => (
    <div className='flex items-center justify-between py-4'>
        <div className='flex items-center gap-4'>
            <span className='text-2xl font-medium text-white'>{quantity}</span>
            <div className='flex flex-col'>
                <span className='font-medium text-white'>{name}</span>
                <span className='text-sm text-white/70'>{unitFormat}</span>
            </div>
        </div>
        <div className='flex gap-2'>
            <button
                onClick={() => onValidate(true)}
                className={`rounded-full p-2 transition-colors ${
                    isValidated === true ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
                <Check className='h-6 w-6' />
            </button>
            <button
                onClick={() => onValidate(false)}
                className={`rounded-full p-2 transition-colors ${
                    isValidated === false ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
                <X className='h-6 w-6' />
            </button>
        </div>
    </div>
)

export const ReceiveOrderModal: FC<ReceiveOrderModalProps> = ({ order, isOpen, onClose, onConfirm }) => {
    const [currentStep, setCurrentStep] = useState<ReceiveStep>('validation')
    const [validationState, setValidationState] = useState<{ [key: string]: boolean | null }>({})

    if (!isOpen) return null

    const handleValidation = (itemName: string, isValid: boolean) => {
        setValidationState(prev => ({
            ...prev,
            [itemName]: isValid,
        }))
    }

    const allItemsValidated = order.items.every(
        item => validationState[item.name] !== null && validationState[item.name] !== undefined,
    )

    const hasRejectedItems = Object.values(validationState).some(value => value === false)

    const handleContinue = () => {
        if (hasRejectedItems) {
            setCurrentStep('assistant')
        } else {
            setCurrentStep('upload')
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 'validation':
                return (
                    <>
                        <div className='flex items-center justify-between border-b border-white/10 p-4'>
                            <h2 className='text-xl font-bold text-white'>Comprueba tus productos</h2>
                            <button
                                onClick={onClose}
                                className='rounded-full p-2 text-white transition-colors hover:bg-white/10'
                            >
                                <X className='h-6 w-6' />
                            </button>
                        </div>

                        <div className='flex-1 overflow-auto px-4'>
                            {order.items.map((item, index) => (
                                <div key={index}>
                                    <OrderItemValidation
                                        quantity={item.quantity}
                                        name={item.name}
                                        unitFormat={item.unitFormat}
                                        isValidated={validationState[item.name]}
                                        onValidate={isValid => handleValidation(item.name, isValid)}
                                    />
                                    {index < order.items.length - 1 && <Separator className='bg-white/10' />}
                                </div>
                            ))}
                        </div>

                        <div className='space-y-3 border-t border-white/10 p-4 pb-8'>
                            <Button
                                onClick={handleContinue}
                                className='w-full bg-gray-600 text-white hover:bg-gray-700'
                                disabled={!allItemsValidated}
                            >
                                Continuar
                            </Button>
                            <Button
                                onClick={onClose}
                                variant='outline'
                                className='w-full border-white/20 text-white hover:bg-white/10 hover:text-white'
                            >
                                Cerrar
                            </Button>
                        </div>
                    </>
                )

            case 'upload':
                return (
                    <>
                        <div className='flex items-center justify-between border-b border-white/10 p-4'>
                            <h2 className='text-xl font-bold text-white'>Adjunta el albarán</h2>
                            <button
                                onClick={onClose}
                                className='rounded-full p-2 text-white transition-colors hover:bg-white/10'
                            >
                                <X className='h-6 w-6' />
                            </button>
                        </div>

                        <div className='flex flex-1 flex-col items-center justify-center p-8'>
                            <div className='w-full max-w-md'>
                                <div className='rounded-lg border-2 border-dashed border-white/20 p-8 text-center'>
                                    <Upload className='mx-auto mb-4 h-12 w-12 text-white/50' />
                                    <p className='mb-4 text-white/70'>Haz click o arrastra el albarán aquí</p>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        className='hidden'
                                        onChange={() => setCurrentStep('confirmation')}
                                    />
                                    <Button
                                        variant='outline'
                                        className='border-white/20 text-white hover:bg-white/10'
                                        onClick={() => {
                                            // Trigger file input
                                            setCurrentStep('confirmation')
                                        }}
                                    >
                                        Seleccionar archivo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case 'confirmation':
                return (
                    <>
                        <div className='flex items-center justify-between border-b border-white/10 p-4'>
                            <h2 className='text-xl font-bold text-white'>Confirmar recepción</h2>
                            <button
                                onClick={onClose}
                                className='rounded-full p-2 text-white transition-colors hover:bg-white/10'
                            >
                                <X className='h-6 w-6' />
                            </button>
                        </div>

                        <div className='flex flex-1 flex-col items-center justify-center p-8'>
                            <div className='w-full max-w-md text-center'>
                                <AlertCircle className='mx-auto mb-4 h-12 w-12 text-white' />
                                <h3 className='mb-2 text-lg font-medium text-white'>
                                    ¿Ha ido todo bien con el pedido?
                                </h3>
                                <p className='mb-8 text-white/70'>
                                    Si hay alguna incidencia, nuestro asistente te ayudará a gestionarla
                                </p>
                                <div className='space-y-3'>
                                    <Button
                                        className='w-full bg-green-600 text-white hover:bg-green-700'
                                        onClick={onConfirm}
                                    >
                                        Sí, todo correcto
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className='w-full border-white/20 text-white hover:bg-white/10'
                                        onClick={() => setCurrentStep('assistant')}
                                    >
                                        No, hay incidencias
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case 'assistant':
                return (
                    <>
                        <div className='flex items-center justify-between border-b border-white/10 p-4'>
                            <h2 className='text-xl font-bold text-white'>Asistente de incidencias</h2>
                            <button
                                onClick={onClose}
                                className='rounded-full p-2 text-white transition-colors hover:bg-white/10'
                            >
                                <X className='h-6 w-6' />
                            </button>
                        </div>

                        <div className='flex flex-1 flex-col items-center justify-center p-8'>
                            <div className='w-full max-w-md text-center'>
                                <p className='mb-4 text-white'>
                                    El asistente te ayudará a gestionar las incidencias con los siguientes productos:
                                </p>
                                <div className='mb-6 space-y-2 text-left'>
                                    {order.items.map(
                                        (item, index) =>
                                            validationState[item.name] === false && (
                                                <div key={index} className='rounded bg-white/5 p-3'>
                                                    <span className='text-white'>{item.name}</span>
                                                </div>
                                            ),
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col items-center p-4 pb-8'>
                            <button
                                className='group relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500'
                                onClick={() => {
                                    // Aquí iría la lógica para iniciar la interacción con el asistente
                                }}
                            >
                                <span className='absolute h-full w-full animate-ping rounded-full bg-green-500/60' />
                                <span className='absolute h-full w-full animate-pulse rounded-full bg-green-500/40' />
                                <svg
                                    className='h-8 w-8 transform text-white transition-transform group-hover:scale-110'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
                                    />
                                </svg>
                            </button>
                            <span className='mt-4 text-white/70'>Pulsa para hablar</span>
                        </div>
                    </>
                )
        }
    }

    return <div className='fixed inset-0 z-50 flex min-h-screen flex-col bg-background'>{renderStep()}</div>
}
