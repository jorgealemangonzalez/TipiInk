import { useNavigate, useParams } from 'react-router-dom'

import { AlertTriangle, Calendar, Clock, Download, FileText, Package } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSupplier } from '@/entities/supplier/model/hooks'
import { Supplier } from '@/entities/supplier/model/types'
import { BackButton } from '@/shared/ui/back-button'

import { FloatingContactButtons } from '../features/contact-buttons'

type DeliveryInfoProps = {
    deliveryDays: string[]
    orderAdvanceHours: number
}

function DeliveryInfo({ deliveryDays, orderAdvanceHours }: DeliveryInfoProps) {
    return (
        <div className='space-y-4'>
            <div>
                <h4 className='mb-1 text-sm font-medium text-gray-400'>Días de Reparto</h4>
                <div className='flex flex-wrap gap-2'>
                    {deliveryDays.map(day => (
                        <span key={day} className='rounded-full bg-primary/10 px-3 py-1 text-sm text-primary'>
                            {day}
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <h4 className='mb-1 text-sm font-medium text-gray-400'>Antelación</h4>
                <p className='flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    {orderAdvanceHours} horas
                </p>
            </div>
        </div>
    )
}

type IncidentDialogProps = {
    incidentDetails: {
        description: string
        affectedItems: string[]
        reportDate: string
        status: string
    }
    noteId: string
}

function IncidentDialog({ incidentDetails, noteId }: IncidentDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant='ghost'
                    className='h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive'
                >
                    <AlertTriangle className='mr-2 h-4 w-4' />
                    Incidencia
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2 text-destructive'>
                        <AlertTriangle className='h-5 w-5' />
                        Detalles de la Incidencia
                    </DialogTitle>
                    <DialogDescription>
                        Información sobre la incidencia reportada en el albarán {noteId}
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right text-gray-400'>Fecha</Label>
                        <div className='col-span-3'>{new Date(incidentDetails.reportDate).toLocaleDateString()}</div>
                    </div>
                    <div className='grid grid-cols-4 items-start gap-4'>
                        <Label className='text-right text-gray-400'>Descripción</Label>
                        <div className='col-span-3'>{incidentDetails.description}</div>
                    </div>
                    <div className='grid grid-cols-4 items-start gap-4'>
                        <Label className='text-right text-gray-400'>Productos</Label>
                        <div className='col-span-3'>
                            <ul className='list-disc space-y-1 pl-4'>
                                {incidentDetails.affectedItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right text-gray-400'>Estado</Label>
                        <div className='col-span-3'>
                            <span className='rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-500'>
                                Pendiente de resolución
                            </span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type='button' variant='outline'>
                        Marcar como resuelto
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

type PendingDeliveryNotesTableProps = {
    deliveryNotes: Supplier['deliveryNotes']
}

function PendingDeliveryNotesTable({ deliveryNotes }: PendingDeliveryNotesTableProps) {
    const pendingDeliveryNotes = deliveryNotes.filter(note => !note.invoiceId)

    if (pendingDeliveryNotes.length === 0) {
        return <div className='py-8 text-center text-muted-foreground'>No hay albaranes pendientes</div>
    }

    return (
        <ScrollArea className='h-[300px]'>
            <div className='space-y-1'>
                {pendingDeliveryNotes.map((note, index) => (
                    <div key={note.id}>
                        <div className='flex items-center justify-between bg-background px-2 py-4 transition-colors hover:bg-gray-700/30'>
                            <div className='space-y-1'>
                                <div className='flex items-center gap-2'>
                                    <span className='font-medium'>{note.id}</span>
                                    <span className='text-sm text-gray-400'>
                                        {new Date(note.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className='text-lg font-semibold'>{note.total.toLocaleString()}€</p>
                            </div>
                            {note.hasIncidents && note.incidentDetails && (
                                <IncidentDialog incidentDetails={note.incidentDetails} noteId={note.id} />
                            )}
                        </div>
                        {index < pendingDeliveryNotes.length - 1 && <Separator className='bg-gray-700/50' />}
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

type InvoicesTableProps = {
    invoices: Supplier['invoices']
}

function InvoicesTable({ invoices }: InvoicesTableProps) {
    if (invoices.length === 0) {
        return <div className='py-8 text-center text-muted-foreground'>No hay facturas disponibles</div>
    }

    return (
        <ScrollArea className='h-[300px]'>
            <div className='space-y-1'>
                {invoices.map((invoice, index) => (
                    <div key={invoice.id}>
                        <div className='flex items-center justify-between px-2 py-4 transition-colors hover:bg-gray-700/30'>
                            <div className='space-y-1'>
                                <div className='flex items-center gap-2'>
                                    <span className='font-medium'>{invoice.id}</span>
                                    <span className='text-sm text-gray-400'>
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <p className='text-lg font-semibold'>{invoice.total.toLocaleString()}€</p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            invoice.status === 'paid'
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-yellow-500/20 text-yellow-500'
                                        }`}
                                    >
                                        {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
                                    </span>
                                </div>
                            </div>
                            {invoice.pdfUrl && (
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => window.open(invoice.pdfUrl, '_blank')}
                                >
                                    <Download className='h-4 w-4' />
                                </Button>
                            )}
                        </div>
                        {index < invoices.length - 1 && <Separator className='bg-gray-700/50' />}
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

type DocumentsTabsProps = {
    deliveryNotes: Supplier['deliveryNotes']
    invoices: Supplier['invoices']
}

function DocumentsTabs({ deliveryNotes, invoices }: DocumentsTabsProps) {
    return (
        <Tabs defaultValue='pending' className='w-full'>
            <TabsList className='mb-4 grid w-full grid-cols-2'>
                <TabsTrigger value='pending' className='data-[state=active]:bg-primary data-[state=active]:text-black'>
                    Albaranes
                </TabsTrigger>
                <TabsTrigger value='invoices' className='data-[state=active]:bg-primary data-[state=active]:text-black'>
                    Facturas
                </TabsTrigger>
            </TabsList>

            <TabsContent value='pending'>
                <PendingDeliveryNotesTable deliveryNotes={deliveryNotes} />
            </TabsContent>

            <TabsContent value='invoices'>
                <InvoicesTable invoices={invoices} />
            </TabsContent>
        </Tabs>
    )
}

function ActionButtons() {
    const navigate = useNavigate()
    return (
        <div className='grid grid-cols-2 gap-4'>
            <Button variant='secondary' size='lg' onClick={() => navigate('addInvoice')}>
                <FileText className='mr-2 h-4 w-4' />
                Factura
            </Button>

            <Button size='lg'>
                <Package className='mr-2 h-4 w-4' />
                Pedido
            </Button>
        </div>
    )
}

export function SupplierDetailsPage() {
    const { supplierId } = useParams()
    const supplier = useSupplier(supplierId!)

    if (!supplier) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center'>
                <h1 className='mb-4 text-xl font-bold'>Proveedor no encontrado</h1>
                <Button onClick={() => window.history.back()}>Volver</Button>
            </div>
        )
    }

    return (
        <div className='flex flex-col justify-between p-6'>
            <div className='flex items-center justify-center pb-6'>
                <BackButton className='absolute left-4' />
                <h1 className='flex-1 text-center text-xl font-bold text-white'>{supplier.name}</h1>
                <div className='absolute right-4'>
                    <FloatingContactButtons
                        commercialPhone={supplier.commercialPhone}
                        deliveryPhone={supplier.deliveryPhone}
                    />
                </div>
            </div>

            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2 text-lg'>
                            <Calendar className='h-5 w-5' />
                            Información de Reparto
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DeliveryInfo
                            deliveryDays={supplier.deliveryDays}
                            orderAdvanceHours={supplier.orderAdvanceHours}
                        />
                    </CardContent>
                </Card>

                <DocumentsTabs deliveryNotes={supplier.deliveryNotes} invoices={supplier.invoices} />
            </div>

            <ActionButtons />
        </div>
    )
}
