import { ChangeEvent, FC } from 'react'

interface ProductionTimeProps {
    productionTime?: string
    onProductionTimeChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const ProductionTime: FC<ProductionTimeProps> = ({ productionTime, onProductionTimeChange }) => {
    const extractMinutes = (timeString?: string): string => {
        if (!timeString) return ''
        const match = timeString.match(/(\d+)/)
        return match ? match[1] : ''
    }

    return (
        <div className='border-border mt-6 flex items-center justify-between border-t pt-4'>
            <p className='text-primary/80 text-sm'>Tiempo de producción</p>
            <div className='flex items-center gap-2'>
                <input
                    type='number'
                    className='text-primary h-8 w-16 border-none bg-transparent text-right text-xl font-semibold focus:outline-none'
                    value={extractMinutes(productionTime)}
                    onChange={onProductionTimeChange}
                    placeholder='0'
                />
                <span className='text-primary text-xl font-semibold'>min</span>
            </div>
        </div>
    )
}
