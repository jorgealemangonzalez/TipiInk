import { useNavigate, useParams } from 'react-router-dom'

import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSuppliers } from '@/entities/supplier/model/supplierHooks'
import { BackButton } from '@/shared/ui/back-button'

export function AddInvoicePage() {
    const { supplierId } = useParams()
    const navigate = useNavigate()
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

    return (
        <div className='flex min-h-screen flex-col p-6'>
            <div className='relative flex items-center pb-6'>
                <BackButton className='absolute' />
                <h1 className='w-full text-center text-xl font-bold text-white'>Nueva factura</h1>
            </div>

            <div className='flex-1 space-y-6'>
                <Card className='p-6'>
                    <h3 className='mb-4 text-lg font-semibold'>Comprobación de Incidencias</h3>

                    {(supplier.pendingIncidents || 0) > 0 ? (
                        <Alert variant='destructive' className='mb-4'>
                            <AlertCircle className='h-4 w-4' />
                            <AlertTitle>Incidencias Pendientes</AlertTitle>
                            <AlertDescription>
                                Existen incidencias pendientes que deben ser resueltas antes de procesar la factura
                            </AlertDescription>
                        </Alert>
                    ) : null}

                    <div className='space-y-4'>
                        {(supplier.deliveryNotes || [])
                            .filter(note => !note.invoiceId)
                            .map(note => (
                                <Card key={note.id} className='p-4'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <h4 className='font-medium'>{note.id}</h4>
                                            <p className='text-muted-foreground text-sm'>
                                                Fecha: {new Date(note.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span
                                                className={`rounded-full px-2 py-1 text-sm ${
                                                    note.hasIncidents
                                                        ? 'bg-destructive/10 text-destructive'
                                                        : 'bg-green-100 text-green-700'
                                                }`}
                                            >
                                                {note.hasIncidents ? 'Pendiente' : 'Resuelto'}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                    </div>
                </Card>
            </div>

            <div className='sticky bottom-6'>
                <Button
                    className='w-full'
                    onClick={() => navigate(`/supplier-management/${supplierId}/addInvoice/summary`)}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}
