import { FC } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { ActiveOrders } from '@/widgets/active-orders/ui/ActiveOrders'
import { PendingOrders } from '@/widgets/pending-orders'

export const Home: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onAssistantClick={() => {}} />
      <div className="flex-1 px-4 pt-6 mt-[173px] pb-[400px]">
        <div className="space-y-8">
          <PendingOrders />
          <ActiveOrders />
        </div>
      </div>
    </div>
  )
} 