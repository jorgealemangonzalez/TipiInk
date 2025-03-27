import { FC } from 'react'

import { Info } from 'lucide-react'

import { Tooltip, TooltipProvider } from '@/components/ui/tooltip'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

interface RecipePricingProps {
    pvp: number
    costPerServing: number
    costPercentage: number
    servingsPerProduction: number
    productionCost: number
}

const getPercentageColor = (percentage: number): string => {
    if (percentage < 20) return 'text-emerald-500'
    if (percentage <= 25) return 'text-green-400'
    if (percentage <= 30) return 'text-yellow-400'
    if (percentage <= 32) return 'text-orange-400'
    return 'text-red-500'
}

export const RecipePricing: FC<RecipePricingProps> = ({
    pvp,
    costPerServing,
    costPercentage,
    servingsPerProduction,
    productionCost,
}) => {
    return (
        <div className='text-primary grid grid-cols-2 gap-4'>
            <div>
                <p className='text-primary/80 text-sm'>PVP</p>
                <p className='text-xl font-semibold'>{pvp.toFixed(2)}€</p>
            </div>
            <div>
                <p className='text-primary/80 flex items-center gap-1 text-sm'>
                    Coste por ración
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipPrimitive.Root>
                                <TooltipPrimitive.Trigger asChild>
                                    <Info className='text-primary/60 h-3.5 w-3.5 cursor-help' />
                                </TooltipPrimitive.Trigger>
                                <TooltipPrimitive.Portal>
                                    <TooltipPrimitive.Content
                                        side='top'
                                        align='center'
                                        className='text-primary animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-[--radix-tooltip-content-transform-origin] overflow-hidden rounded-md border-gray-800 bg-gray-900 px-3 py-1.5 text-xs'
                                    >
                                        <p className='max-w-60 text-xs'>Suma de los costes de ingredientes</p>
                                    </TooltipPrimitive.Content>
                                </TooltipPrimitive.Portal>
                            </TooltipPrimitive.Root>
                        </Tooltip>
                    </TooltipProvider>
                </p>
                <p className='text-xl font-semibold'>
                    <span className={getPercentageColor(costPercentage)}>{costPerServing.toFixed(2)}€</span>
                    <span className='ml-2 text-sm'>
                        (<span className={getPercentageColor(costPercentage)}>{costPercentage.toFixed(0)}% Coste</span>)
                    </span>
                </p>
            </div>
            <div>
                <p className='text-primary/80 text-sm'>Raciones por producción</p>
                <p className='text-xl font-semibold'>{servingsPerProduction}</p>
            </div>
            <div>
                <p className='text-primary/80 text-sm'>Coste por producción</p>
                <p className='text-xl font-semibold'>{productionCost.toFixed(2)}€</p>
            </div>
        </div>
    )
}
