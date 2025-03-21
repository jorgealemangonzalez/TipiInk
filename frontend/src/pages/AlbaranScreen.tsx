import { ArrowLeft, Eye } from 'lucide-react'

import { useUser } from '@/auth'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import { useDocument } from '@/firebase/hooks/useDocument.tsx'

import { Invoice as InvoiceData, Item } from '../../../backend/functions/src/types/ExtractInvoice'

export function AlbaranScreen({
    setActiveScreen,
    invoiceId,
    setShowImagePopup,
}: {
    setActiveScreen: (screen: string) => void
    invoiceId: string
    setShowImagePopup: (show: boolean) => void
}) {
    const user = useUser()
    const { document: invoiceData, setDocument: setInvoiceData } = useDocument<InvoiceData>({
        collectionName: `companies/${user.companyId}/invoices`,
        id: invoiceId,
    })

    const handleInputChange = (field: keyof InvoiceData, value: string) => {
        if (!invoiceData) return
        setInvoiceData({
            [field]: value,
        })
    }

    const handleItemChange = (index: number, field: keyof Item, value: string) => {
        if (!invoiceData) return
        const newItems = invoiceData.items ? [...invoiceData.items] : []
        newItems[index] = {
            ...newItems[index],
            [field]: field === 'item' ? value : parseFloat(value) || 0,
        }
        newItems[index].total =
            (newItems[index].quantity ?? 0) * (newItems[index].price ?? 0) * (1 + (newItems[index].vat_type ?? 0) / 100)

        const subtotal = newItems.reduce((sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0), 0)
        const total_vat = newItems.reduce(
            (sum, item) => sum + ((item.quantity ?? 0) * (item.price ?? 0) * (item.vat_type ?? 0)) / 100,
            0,
        )
        const total = subtotal + total_vat

        setInvoiceData({
            items: newItems,
            subtotal,
            total_vat,
            total,
        })
    }

    if (!invoiceData) return null

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
            <div className='rounded-lg bg-white p-6 shadow-lg'>
                <h2 className='mb-6 text-3xl font-bold text-[#12323a]'>Datos del Albarán</h2>
                <div className='mb-6 grid grid-cols-2 gap-4'>
                    <div>
                        <label className='text-sm font-medium text-[#12323a]'>Proveedor</label>
                        <Input
                            value={invoiceData.provider ?? ''}
                            onChange={e => handleInputChange('provider', e.target.value)}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium text-[#12323a]'>Nº Serie</label>
                        <Input
                            value={invoiceData.serial_number ?? ''}
                            onChange={e => handleInputChange('serial_number', e.target.value)}
                            className='mt-1'
                        />
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Artículo</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Tipo de IVA</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoiceData.items?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            value={item.item ?? ''}
                                            onChange={e => handleItemChange(index, 'item', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type='number'
                                            value={item.quantity ?? ''}
                                            onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type='number'
                                            value={item.price ?? ''}
                                            onChange={e => handleItemChange(index, 'price', e.target.value)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Select
                                            value={item.vat_type?.toString() ?? '0'}
                                            onValueChange={value => handleItemChange(index, 'vat_type', value)}
                                        >
                                            <SelectTrigger className='w-[180px]'>
                                                <SelectValue placeholder='Seleccionar IVA' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='0'>0%</SelectItem>
                                                <SelectItem value='5'>5%</SelectItem>
                                                <SelectItem value='10'>10%</SelectItem>
                                                <SelectItem value='21'>21%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{item.total?.toFixed(2) ?? ''}€</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className='mt-4 space-y-2'>
                    <div className='flex justify-end'>
                        <span className='mr-4 font-medium'>Subtotal:</span>
                        <span>{invoiceData.subtotal?.toFixed(2) ?? ''}€</span>
                    </div>
                    <div className='flex justify-end'>
                        <span className='mr-4 font-medium'>Total IVA:</span>
                        <span>{invoiceData.total_vat?.toFixed(2) ?? ''}€</span>
                    </div>
                    <div className='flex justify-end text-lg font-bold'>
                        <span className='mr-4'>Total:</span>
                        <span>{invoiceData.total?.toFixed(2) ?? ''}€</span>
                    </div>
                </div>
            </div>
            <Button
                onClick={() => setShowImagePopup(true)}
                className='mt-6 transform self-center rounded-full bg-[#3fc1c9] px-8 py-4 text-lg text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#3F7CC9]'
            >
                <Eye className='mr-2 h-6 w-6' />
                Ver Imagen del Albarán
            </Button>
        </div>
    )
}
