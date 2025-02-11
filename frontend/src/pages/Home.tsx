import { FC } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { PendingOrders } from '@/widgets/pending-orders'
import { ActiveOrders } from '@/widgets/active-orders'

export const Home: FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header onAssistantClick={() => {}} />
      <div className="h-full overflow-hidden">
        <div className='relative w-full h-1/2 z-1'>
          <PendingOrders collapsed />
        </div>
        <div className='relative w-full h-1/2 z-60'>
          <ActiveOrders collapsed />
        </div>
      </div>
    </div>
  )
} 