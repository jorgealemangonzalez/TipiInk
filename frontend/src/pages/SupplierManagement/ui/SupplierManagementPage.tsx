import { useNavigate } from 'react-router-dom'

import { Beef, Package, Phone, Truck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
// import { useSuppliers } from '@/entities/supplier/model/hooks'
import { useSuppliers } from '@/entities/supplier/model/supplierHooks'
import { Supplier } from '@tipi/shared'
import { BackButton } from '@/shared/ui/back-button'

const SupplierIcon = ({ type }: { type: Supplier['type'] }) => {
    switch (type) {
        case 'pescaderia':
            return <Package className='h-6 w-6 text-blue-400' />
        case 'fruteria':
            return <Truck className='h-6 w-6 text-green-400' />
        case 'carniceria':
            return <Beef className='h-6 w-6 text-red-400' />
    }
}

export function SupplierManagementPage() {
    const navigate = useNavigate()
    const { isLoading, getAllSuppliers } = useSuppliers()
    const allSuppliers = getAllSuppliers()

    const handleSupplierClick = (supplierId: string) => {
        navigate(`/supplier-management/${supplierId}`)
    }

    console.log('allSuppliers', allSuppliers)

    if (isLoading) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <p className='text-primary text-xl'>Cargando proveedores...</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen'>
            <div className='relative flex items-center p-4'>
                <BackButton className='absolute left-4' />
                <h1 className='w-full text-center text-xl font-bold text-white'>Gestión de Proveedores</h1>
            </div>

            <div className='max-w-3xl px-6'>
                <div className='space-y-1'>
                    {allSuppliers.map((supplier, index) => (
                        <div key={supplier.id}>
                            <div
                                onClick={() => handleSupplierClick(supplier.id)}
                                className='group flex cursor-pointer items-center justify-between px-2 py-4 transition-colors hover:bg-gray-700/30'
                            >
                                <div className='flex items-center gap-4'>
                                    <SupplierIcon type={supplier.type} />
                                    <div>
                                        <h3 className='text-xl font-semibold text-white'>{supplier.name}</h3>
                                        <p className='text-sm text-gray-400'>
                                            {supplier.pendingIncidents} incidencias pendientes
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant='link'
                                    size='icon'
                                    className='rounded-full'
                                    onClick={e => {
                                        e.stopPropagation()
                                        window.open(`tel:${supplier.commercialPhone}`, '_blank')
                                    }}
                                >
                                    <Phone className='h-4 w-4' />
                                </Button>
                            </div>
                            {index < allSuppliers.length - 1 && <Separator className='bg-gray-700/50' />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
