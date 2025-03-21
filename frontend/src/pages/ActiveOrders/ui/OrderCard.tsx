import { FC, useState } from 'react'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ClipboardCheck, Clock, Mic } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { formatDeliveryDate } from '@/entities/order/lib/format'
import { CATEGORY_STYLES, DRAG_THRESHOLDS } from '@/entities/order/model/constants'
import { OrderStatus, PendingOrder } from '@/entities/order/model/types'
import { cn } from '@/lib/utils'

import { OrderItemRow } from './OrderItemRow'
import { ReceiveOrderModal } from './ReceiveOrderModal'

interface OrderCardProps {
    order: PendingOrder & { status: OrderStatus }
    disableDrag?: boolean
    className?: string
}

const StatusBadge: FC<{ status: OrderStatus }> = ({ status }) => {
    const statusConfig = {
        confirmed: { text: 'Confirmado' },
        unconfirmed: { text: 'Sin confirmar' },
        with_delivery_time: { text: 'Programado' },
    }

    const config = statusConfig[status]

    return <span className='rounded-full bg-white px-3 py-1 text-xs font-medium text-black'>{config.text}</span>
}

export const OrderCard: FC<OrderCardProps> = ({ order, disableDrag, className }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false)
    const x = useMotionValue(0)

    const rightBgOpacity = useTransform(
        x,
        [0, DRAG_THRESHOLDS.opacityStart, DRAG_THRESHOLDS.actionTrigger],
        [0, 0.5, 1],
    )
    const leftBgOpacity = useTransform(
        x,
        [-DRAG_THRESHOLDS.actionTrigger, -DRAG_THRESHOLDS.opacityStart, 0],
        [1, 0.5, 0],
    )
    const rightIconScale = useTransform(x, [DRAG_THRESHOLDS.scaleStart, DRAG_THRESHOLDS.actionTrigger], [0.8, 1])
    const leftIconScale = useTransform(x, [-DRAG_THRESHOLDS.actionTrigger, -DRAG_THRESHOLDS.scaleStart], [1, 0.8])
    const rightIconRotate = useTransform(x, [0, DRAG_THRESHOLDS.actionTrigger], [0, 10])
    const leftIconRotate = useTransform(x, [-DRAG_THRESHOLDS.actionTrigger, 0], [-10, 0])
    const cardScale = useTransform(
        x,
        [-DRAG_THRESHOLDS.actionTrigger, 0, DRAG_THRESHOLDS.actionTrigger],
        [0.95, 1, 0.95],
    )
    const cardRotate = useTransform(x, [-DRAG_THRESHOLDS.actionTrigger, 0, DRAG_THRESHOLDS.actionTrigger], [-3, 0, 3])

    const handleDragEnd = () => {
        setIsDragging(false)
        const xValue = x.get()

        if (xValue > DRAG_THRESHOLDS.actionTrigger) {
            setIsReceiveModalOpen(true)
        } else if (xValue < -DRAG_THRESHOLDS.actionTrigger) {
            console.log('Edit order:', order)
        }
    }

    return (
        <>
            <div className={cn('relative', className)}>
                {!disableDrag && (
                    <>
                        <motion.div
                            className='pointer-events-none absolute inset-0 flex items-center justify-start rounded-[35px] bg-green-500 px-8'
                            style={{ opacity: rightBgOpacity }}
                        >
                            <motion.div
                                style={{ scale: rightIconScale, rotate: rightIconRotate }}
                                className='flex flex-col items-center gap-1'
                            >
                                <ClipboardCheck className='h-8 w-8 text-white' />
                                <span className='text-sm font-medium text-white'>Recepcionar</span>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className='pointer-events-none absolute inset-0 flex items-center justify-end rounded-[35px] bg-blue-500 px-8'
                            style={{ opacity: leftBgOpacity }}
                        >
                            <motion.div
                                style={{ scale: leftIconScale, rotate: leftIconRotate }}
                                className='flex flex-col items-center gap-1'
                            >
                                <Mic className='h-8 w-8 text-white' />
                                <span className='text-sm font-medium text-white'>Editar</span>
                            </motion.div>
                        </motion.div>
                    </>
                )}

                <motion.div
                    drag={disableDrag ? false : 'x'}
                    dragConstraints={disableDrag ? undefined : { left: 0, right: 0 }}
                    dragElastic={disableDrag ? undefined : 0.7}
                    dragMomentum={false}
                    onDragStart={() => !disableDrag && setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    style={{
                        x,
                        scale: disableDrag ? 1 : cardScale,
                        rotate: disableDrag ? 0 : cardRotate,
                    }}
                    whileTap={disableDrag ? undefined : { cursor: 'grabbing' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <Card
                        className={cn(
                            'select-none rounded-[35px] border-none shadow-[0_4px_20px_rgba(0,0,0,0.25)]',
                            CATEGORY_STYLES[order.category].bg,
                            !disableDrag && isDragging
                                ? 'cursor-grabbing'
                                : !disableDrag
                                  ? 'cursor-grab'
                                  : 'cursor-pointer',
                        )}
                    >
                        <div className='space-y-4 p-5'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-lg font-bold text-white'>{order.supplierName}</span>
                                    <StatusBadge status={order.status} />
                                </div>
                                {order.status === 'with_delivery_time' && (
                                    <div className='flex items-center gap-2 text-white/70'>
                                        <Clock className='h-4 w-4' />
                                        <span className='text-xs'>
                                            {formatDeliveryDate(order.requestedDeliveryTime)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className='space-y-3'>
                                <div className='flex items-center justify-between px-2 text-xs text-white/70'>
                                    <span className='flex-[2]'>Artículo</span>
                                    <span className='flex-1 text-center'>Cantidad</span>
                                    <span className='flex-1 text-right'>Precio/ud.</span>
                                </div>

                                <div className='space-y-3'>
                                    {order.items.map((item, index) => (
                                        <OrderItemRow key={index} item={item} />
                                    ))}
                                </div>
                            </div>

                            <div className='mr-2 flex items-center justify-end border-t border-white/20 pt-2'>
                                <span className='text-base font-medium text-white'>{order.estimatedPrice}€</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <ReceiveOrderModal
                order={order}
                isOpen={isReceiveModalOpen}
                onClose={() => setIsReceiveModalOpen(false)}
                onConfirm={() => {
                    console.log('Order received:', order)
                    setIsReceiveModalOpen(false)
                }}
            />
        </>
    )
}
