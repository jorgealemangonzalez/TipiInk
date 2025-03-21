import { FC } from 'react'

import { FloatingMicButton } from '@/features/floating-mic'
import { ActiveOrders } from '@/widgets/active-orders'
import { Header } from '@/widgets/header/ui/Header'
import { PendingOrders } from '@/widgets/pending-orders'

export const Home: FC = () => {
    return (
        <div className='flex h-screen flex-col'>
            <Header onAssistantClick={() => {}} />
            <div className='h-full overflow-hidden'>
                <div className='z-1 relative h-1/2 w-full'>
                    <PendingOrders collapsed />
                </div>
                <div className='z-60 relative h-1/2 w-full'>
                    <ActiveOrders collapsed />
                </div>
            </div>
            <FloatingMicButton />
        </div>
    )
}
