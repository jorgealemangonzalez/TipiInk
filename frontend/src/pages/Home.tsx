import { FC } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { ActiveOrders } from '@/widgets/active-orders/ui/ActiveOrders'

export const Home: FC = () => {
  return (
    <div className="min-h-screen bg-main-950">
      <Header onAssistantClick={() => {}} />
      <ActiveOrders />
    </div>
  )
} 