import { useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSuppliers } from '@/entities/supplier/model/supplierHooks'
import { BackButton } from '@/shared/ui/back-button'

export function InvoiceSummaryPage() {
    const { supplierId } = useParams()
    const { isLoading, getAllSuppliers } = useSuppliers()

    const supplier = supplierId ? getAllSuppliers().find(s => s.id === supplierId) : undefined

    if (isLoading) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <p className='text-primary text-xl'>Cargando proveedor...</p>
            </div>
        )
    }

    if (!supplier) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center'>
                <h1 className='mb-4 text-xl font-bold'>Proveedor no encontrado</h1>
                <Button onClick={() => window.history.back()}>Volver</Button>
            </div>
        )
    }

    const pendingDeliveryNotes = (supplier.deliveryNotes || []).filter(note => !note.invoiceId)
    const totalAmount = pendingDeliveryNotes.reduce((acc, note) => acc + note.total, 0)

    return (
        <div className='flex min-h-screen flex-col p-6'>
            <div className='relative flex items-center pb-6'>
                <BackButton className='absolute' />
                <h1 className='w-full text-center text-xl font-bold text-white'>Resumen de Albaranes</h1>
            </div>

            <div className='flex-1 space-y-6'>
                <Card className='p-6'>
                    <h3 className='mb-4 text-lg font-semibold'>Albaranes Pendientes</h3>

                    <div className='space-y-4'>
                        {pendingDeliveryNotes.map(note => (
                            <Card key={note.id} className='p-4'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h4 className='font-medium'>{note.id}</h4>
                                        <p className='text-muted-foreground text-sm'>
                                            Fecha: {new Date(note.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-lg font-semibold'>
                                            {note.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className='mt-6 border-t pt-6'>
                        <div className='flex items-center justify-between'>
                            <span className='text-lg font-semibold'>Total</span>
                            <span className='text-xl font-bold'>
                                {totalAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className='sticky bottom-6'>
                <Button className='w-full'>Subir Factura</Button>
            </div>
        </div>
    )
}
