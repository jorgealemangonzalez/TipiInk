import { FC } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { ActiveOrders } from '@/widgets/active-orders/ui/ActiveOrders'
import { PendingOrders } from '@/widgets/pending-orders'

export const Home: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onAssistantClick={() => {}} />
        <div className="relative">
          <PendingOrders className='absolute top-[50%]' />
          <ActiveOrders className='absolute top-[50%]' />
        </div>
    </div>
  )
} 