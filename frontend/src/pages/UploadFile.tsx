import { useEffect, useState } from 'react'

import {
    AlertTriangle,
    ArrowLeft,
    Camera,
    Check,
    ChevronDown,
    ChevronUp,
    FileText,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react'

import { extractInvoice } from '@/api/clients'
import { useUser } from '@/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { uploadFileToStorage } from '@/firebase/fileStorage.ts'
import { useCollection } from '@/firebase/hooks/useCollection.ts'
import { AlbaranScreen } from '@/pages/AlbaranScreen.tsx'

import { Invoice } from '../../../backend/functions/src/types/ExtractInvoice'

interface DeliveryNote {
    number: string
    total: number
}

interface OldInvoice {
    provider: string
    serial_number: string
    date: string
    total: number
    delivery_notes: DeliveryNote[]
    listed_delivery_notes: string[]
}

export function UploadFilePage() {
    const [activeScreen, setActiveScreen] = useState('main')
    const [isHistorialExpanded, setIsHistorialExpanded] = useState(false)
    const [showImagePopup, setShowImagePopup] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const user = useUser()
    const [invoiceId, setInvoiceId] = useState<string>()

    const [invoice, setInvoice] = useState<OldInvoice>({
        serial_number: 'FAC-001',
        provider: 'Proveedor A',
        date: '2023-05-25',
        total: 200,
        delivery_notes: [
            { number: 'ALB-001', total: 95 },
            { number: 'ALB-002', total: 105 },
        ],
        listed_delivery_notes: ['ALB-001', 'ALB-002', 'ALB-003'],
    })

    const [totalDeliveryNotes, setTotalDeliveryNotes] = useState(0)
    const [totalsMatch, setTotalsMatch] = useState(false)
    const [deliveryNotesMatch, setDeliveryNotesMatch] = useState(false)
    const [missingDeliveryNotes, setMissingDeliveryNotes] = useState<string[]>([])
    const [unlistedDeliveryNotes, setUnlistedDeliveryNotes] = useState<string[]>([])

    useEffect(() => {
        const newTotal = invoice.delivery_notes.reduce((sum, note) => sum + note.total, 0)
        setTotalDeliveryNotes(newTotal)
        setTotalsMatch(newTotal === invoice.total)

        const registeredNotes = new Set(invoice.delivery_notes.map(a => a.number))
        const listedNotes = new Set(invoice.listed_delivery_notes)

        const missing = [...listedNotes].filter(x => !registeredNotes.has(x))
        const unlisted = [...registeredNotes].filter(x => !listedNotes.has(x))

        setMissingDeliveryNotes(missing)
        setUnlistedDeliveryNotes(unlisted)
        setDeliveryNotesMatch(missing.length === 0 && unlisted.length === 0)
    }, [invoice])

    const handleInvoiceChange = (field: keyof OldInvoice, value: string) => {
        setInvoice(prev => ({ ...prev, [field]: field === 'total' ? parseFloat(value) : value }))
    }

    const handleValidateInvoice = () => {
        console.log('Factura validada')
        // Aquí iría la lógica para validar la factura
    }

    const handleFlagInvoice = () => {
        console.log('Factura marcada para verificación manual')
        // Aquí iría la lógica para marcar la factura para verificación manual
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, screen: 'albaran' | 'facturas') => {
        const target = event.target as HTMLInputElement
        if (target.files && target.files[0]) {
            const file = target.files[0]
            const filePath = `users/${user.uid}/${screen}/${file.name}`
            await uploadFileToStorage(filePath, file, totalUploaded => {
                console.log(`Uploaded ${totalUploaded} bytes`)
            })
            setUploadedImage(URL.createObjectURL(file))

            // Call extractInvoice with the image path
            const extractedInvoice = await extractInvoice({ imagePath: filePath })
            console.log('Extracted Invoice:', extractedInvoice)
            setInvoiceId(extractedInvoice.invoiceId)
            // Update state with extracted invoice data if needed
            setActiveScreen(screen)
        }
    }

    const renderScreen = () => {
        switch (activeScreen) {
            case 'main':
                return (
                    <MainScreen
                        isHistorialExpanded={isHistorialExpanded}
                        setIsHistorialExpanded={setIsHistorialExpanded}
                        handleImageUpload={handleImageUpload}
                    />
                )
            case 'albaran':
                return (
                    <AlbaranScreen
                        setActiveScreen={setActiveScreen}
                        invoiceId={invoiceId!}
                        setShowImagePopup={setShowImagePopup}
                    />
                )
            case 'facturas':
                return (
                    <FacturasScreen
                        setActiveScreen={setActiveScreen}
                        invoice={invoice}
                        handleInputChange={handleInvoiceChange}
                        totalDeliveryNotes={totalDeliveryNotes}
                        totalsMatch={totalsMatch}
                        deliveryNotesMatch={deliveryNotesMatch}
                        handleValidateInvoice={handleValidateInvoice}
                        handleFlagInvoice={handleFlagInvoice}
                        missingDeliveryNotes={missingDeliveryNotes}
                        unlistedDeliveryNotes={unlistedDeliveryNotes}
                    />
                )
            default:
                return (
                    <MainScreen
                        isHistorialExpanded={isHistorialExpanded}
                        setIsHistorialExpanded={setIsHistorialExpanded}
                        handleImageUpload={handleImageUpload}
                    />
                )
        }
    }

    return (
        <div className='bg-gradient-to-br from-[#effcfc] to-[#b7e9f7] text-[#12323a]'>
            <div
                className='pointer-events-none absolute inset-0 opacity-5'
                style={{
                    backgroundImage:
                        "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO-hhkB6HCDzvTSyGj36qPalMg4kGkHY0.png')",
                    backgroundSize: '30%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat',
                }}
            />
            <div className='relative z-10 flex min-h-screen flex-col p-6'>{renderScreen()}</div>
            <Dialog open={showImagePopup} onOpenChange={setShowImagePopup}>
                <DialogContent className='max-w-3xl'>
                    <div className='relative'>
                        <img
                            src={uploadedImage || '/placeholder.svg?height=600&width=800'}
                            alt='Documento'
                            className='h-auto w-full'
                            style={{ transform: `scale(${zoomLevel})` }}
                        />
                        <div className='absolute right-2 top-2 flex space-x-2'>
                            <Button
                                size='sm'
                                variant='secondary'
                                onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 3))}
                            >
                                <ZoomIn className='h-4 w-4' />
                            </Button>
                            <Button
                                size='sm'
                                variant='secondary'
                                onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
                            >
                                <ZoomOut className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                    <Button onClick={() => setShowImagePopup(false)} className='absolute right-2 top-2' variant='ghost'>
                        <X className='h-4 w-4' />
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const useInvoices = () => {
    const user = useUser()
    console.log('UseInvoices...')
    const { results: invoices } = useCollection<Invoice>({
        path: `companies/${user.companyId}/invoices`,
        orderBy: ['createdAt', 'desc'],
        limit: 20,
    })
    console.log('Invoices:', invoices)

    return invoices
}

function MainScreen({
    isHistorialExpanded,
    setIsHistorialExpanded,
    handleImageUpload,
}: {
    isHistorialExpanded: boolean
    setIsHistorialExpanded: (expanded: boolean) => void
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, screen: 'albaran' | 'facturas') => void
}) {
    const { displayName } = useUser()
    const invoices = useInvoices()

    return (
        <>
            <div className='mb-8 flex items-start justify-between'>
                <div className='flex items-center space-x-4'>
                    <div>
                        <h2 className='text-3xl font-semibold text-[#3F7CC9]'>Bienvenido {displayName}</h2>
                    </div>
                </div>
            </div>
            <div className='flex flex-grow flex-col justify-center'>
                <div className='flex w-full gap-8'>
                    <label className='flex h-fit flex-1 transform cursor-pointer flex-col items-center justify-center space-y-4 rounded-3xl bg-gradient-to-br from-[#3FC98C] to-[#3F7CC9] p-8 text-xl text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:from-[#3F7CC9] hover:to-[#3FC98C]'>
                        <FileText className='size-16' />
                        <span className='font-semibold'>Factura</span>
                        <input
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={e => handleImageUpload(e, 'facturas')}
                        />
                    </label>
                    <label className='flex h-fit flex-1 transform cursor-pointer flex-col items-center justify-center space-y-4 rounded-3xl bg-gradient-to-br from-[#3fc1c9] to-[#3F7CC9] p-8 text-xl text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:from-[#3F7CC9] hover:to-[#3fc1c9]'>
                        <Camera className='size-16' />
                        <span className='font-semibold'>Albarán</span>
                        <input
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={e => handleImageUpload(e, 'albaran')}
                        />
                    </label>
                </div>
            </div>
            {invoices.length > 0 && (
                <Card className='mt-auto bg-white bg-opacity-90 shadow-xl'>
                    <CardContent className='p-6'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h2 className='flex items-center text-2xl font-semibold text-[#12323a]'>Historial</h2>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => setIsHistorialExpanded(!isHistorialExpanded)}
                                className='text-[#12323a] transition-colors duration-200 hover:bg-[#3fc1c9] hover:text-white'
                            >
                                {isHistorialExpanded ? (
                                    <ChevronDown className='h-6 w-6' />
                                ) : (
                                    <ChevronUp className='h-6 w-6' />
                                )}
                            </Button>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isHistorialExpanded ? 'max-h-64 opacity-100' : 'max-h-14'
                            }`}
                        >
                            <ScrollArea className='h-64'>
                                {invoices.map(invoice => (
                                    <div
                                        key={invoice.id}
                                        className='mb-4 rounded-lg bg-gradient-to-r from-[#b7f0fe] to-[#d8f8ff] p-4 shadow transition-all duration-200 hover:shadow-md'
                                    >
                                        <div className='flex items-center justify-between'>
                                            <p className='flex items-center font-medium text-[#12323a]'>
                                                <FileText className='mr-2 h-4 w-4 text-[#3F7CC9]' />
                                                {invoice.provider} - {invoice.serial_number}
                                            </p>
                                            <p className='text-sm text-[#3F7CC9]'>
                                                {invoice.createdAt.toDate().toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

function FacturasScreen({
    setActiveScreen,
    invoice,
    handleInputChange,
    totalDeliveryNotes,
    totalsMatch,
    deliveryNotesMatch,
    handleValidateInvoice,
    handleFlagInvoice,
    missingDeliveryNotes,
    unlistedDeliveryNotes,
}: {
    setActiveScreen: (screen: string) => void
    invoice: OldInvoice
    handleInputChange: (field: keyof OldInvoice, value: string) => void
    totalDeliveryNotes: number
    totalsMatch: boolean
    deliveryNotesMatch: boolean
    handleValidateInvoice: () => void
    handleFlagInvoice: () => void
    missingDeliveryNotes: string[]
    unlistedDeliveryNotes: string[]
}) {
    return (
        <div className='flex h-full flex-col'>
            <Button
                onClick={() => setActiveScreen('main')}
                variant='ghost'
                className='mb-4 self-start text-[#12323a] transition-colors duration-200 hover:bg-[#3fc1c9] hover:text-white'
            >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Volver
            </Button>
            <h2 className='mb-6 text-3xl font-bold text-[#12323a]'>Verificación de Factura</h2>
            <div className='mb-6 rounded-lg bg-white p-6 shadow-lg'>
                <div className='mb-6 grid grid-cols-2 gap-4'>
                    <div>
                        <label className='text-sm font-medium text-[#12323a]'>Número de Factura</label>
                        <Input
                            value={invoice.serial_number}
                            onChange={e => handleInputChange('serial_number', e.target.value)}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium text-[#12323a]'>Proveedor</label>
                        <Input
                            value={invoice.provider}
                            onChange={e => handleInputChange('provider', e.target.value)}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium text-[#12323a]'>Fecha</label>
                        <Input
                            type='date'
                            value={invoice.date}
                            onChange={e => handleInputChange('date', e.target.value)}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium text-[#12323a]'>Total Factura</label>
                        <Input
                            type='number'
                            value={invoice.total}
                            onChange={e => handleInputChange('total', e.target.value)}
                            className='mt-1'
                        />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Albaranes Asociados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Número de Albarán</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.delivery_notes.map((note, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{note.number}</TableCell>
                                        <TableCell>{note.total}€</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className='space-y-4'>
                <Alert variant={totalsMatch ? 'default' : 'destructive'}>
                    <AlertTitle>Verificación de Totales</AlertTitle>
                    <AlertDescription>
                        Total Factura: {invoice.total}€<br />
                        Total Albaranes: {totalDeliveryNotes}€<br />
                        {totalsMatch ? 'Los totales coinciden' : 'Hay una discrepancia en los totales'}
                    </AlertDescription>
                </Alert>
                <Alert variant={deliveryNotesMatch ? 'default' : 'destructive'}>
                    <AlertTitle>Verificación de Albaranes</AlertTitle>
                    <AlertDescription>
                        {deliveryNotesMatch ? (
                            'Todos los albaranes listados están registrados y coinciden'
                        ) : (
                            <>
                                <p>Hay discrepancias entre los albaranes listados y los registrados:</p>
                                {missingDeliveryNotes.length > 0 && (
                                    <p>Albaranes faltantes: {missingDeliveryNotes.join(', ')}</p>
                                )}
                                {unlistedDeliveryNotes.length > 0 && (
                                    <p className='text-red-500'>
                                        Albaranes no listados en la factura: {unlistedDeliveryNotes.join(', ')}
                                    </p>
                                )}
                            </>
                        )}
                    </AlertDescription>
                </Alert>
            </div>
            <div className='mt-6 flex justify-end space-x-4'>
                <Button
                    onClick={handleValidateInvoice}
                    className='bg-green-500 text-white hover:bg-green-600'
                    disabled={!totalsMatch || !deliveryNotesMatch}
                >
                    <Check className='mr-2 h-4 w-4' />
                    Validar Factura
                </Button>
                <Button onClick={handleFlagInvoice} className='bg-yellow-500 text-white hover:bg-yellow-600'>
                    <AlertTriangle className='mr-2 h-4 w-4' />
                    Marcar para Verificación Manual
                </Button>
            </div>
        </div>
    )
}
