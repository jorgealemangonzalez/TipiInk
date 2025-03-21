import { FC } from 'react'

import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { SupplierOrder } from '../model/types'

const SUPPLIERS = {
    PESCADERIA: 'Pescaderia La Central',
    FRUTERIA: 'Fruteria El Huertano',
    CARNICERIA: 'Carniceria Paco',
} as const

// Mock data - Replace with real data later
const mockOrders: SupplierOrder[] = [
    {
        id: 'PED-001',
        origin: SUPPLIERS.PESCADERIA,
        destination: 'Almacén Central',
        status: 'transit',
        orderDate: '20 Mar 2024',
        estimatedDate: '21 Mar 2024',
        products: [],
        total: 0,
    },
    {
        id: 'PED-002',
        origin: SUPPLIERS.FRUTERIA,
        destination: 'Almacén Central',
        status: 'delivered',
        orderDate: '19 Mar 2024',
        estimatedDate: '20 Mar 2024',
        products: [],
        total: 0,
    },
    {
        id: 'PED-003',
        origin: SUPPLIERS.CARNICERIA,
        destination: 'Almacén Central',
        status: 'delivered',
        orderDate: '18 Mar 2024',
        estimatedDate: '19 Mar 2024',
        products: [],
        total: 0,
    },
]

interface OrderCardProps {
    order: SupplierOrder
}

const OrderCard: FC<OrderCardProps> = ({ order }) => {
    return (
        <Card className='border-border/40 mb-3 border bg-transparent'>
            <CardContent className='p-4'>
                <div className='mb-2 flex items-start justify-between'>
                    <h3 className='text-primary text-2xl font-bold'>{order.id}</h3>
                    <Badge variant='outline' className='border-primary/40 text-primary'>
                        {order.status === 'delivered' ? 'Entregado' : 'En Tránsito'}
                    </Badge>
                </div>
                <div className='text-primary/70 flex items-center text-sm'>
                    <span>{order.origin}</span>
                    <ArrowRight className='mx-2 h-4 w-4' />
                    <span>{order.destination}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export const SupplierOrders: FC = () => {
    return (
        <Card className='border-border/40 border bg-transparent shadow-md'>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle className='text-primary mb-4 text-xl font-medium'>Seleccionar Proveedor</CardTitle>
                        <Select>
                            <SelectTrigger className='border-border/40 w-[280px] bg-transparent'>
                                <SelectValue placeholder='Selecciona un proveedor' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={SUPPLIERS.PESCADERIA}>{SUPPLIERS.PESCADERIA}</SelectItem>
                                <SelectItem value={SUPPLIERS.FRUTERIA}>{SUPPLIERS.FRUTERIA}</SelectItem>
                                <SelectItem value={SUPPLIERS.CARNICERIA}>{SUPPLIERS.CARNICERIA}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Badge variant='outline' className='border-primary/40 text-primary'>
                        En Tránsito
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                {/* Progress Bar */}
                <div className='mb-6'>
                    <div className='text-primary/70 mb-2 flex justify-between text-sm'>
                        <div>
                            <p>{mockOrders[0].orderDate}</p>
                            <p>{mockOrders[0].origin}</p>
                        </div>
                        <div className='text-right'>
                            <p>Estimado: {mockOrders[0].estimatedDate}</p>
                            <p>{mockOrders[0].destination}</p>
                        </div>
                    </div>
                    <div className='bg-primary/20 relative h-1 rounded-full'>
                        <div className='bg-primary/40 absolute left-0 top-0 h-full w-1/3 rounded-full' />
                        <div className='bg-primary absolute left-0 top-0 h-3 w-3 -translate-y-1 rounded-full' />
                        <div className='bg-primary absolute left-1/3 top-0 h-3 w-3 -translate-y-1 rounded-full' />
                        <div className='bg-primary/20 absolute right-0 top-0 h-3 w-3 -translate-y-1 rounded-full' />
                    </div>
                </div>

                {/* Recent Shipping */}
                <div>
                    <div className='mb-4 flex items-center justify-between'>
                        <h3 className='text-primary text-lg font-medium'>Pedidos Recientes</h3>
                        <button className='text-primary/70 hover:text-primary text-sm'>Ver Todos</button>
                    </div>
                    <div>
                        {mockOrders.slice(1).map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
