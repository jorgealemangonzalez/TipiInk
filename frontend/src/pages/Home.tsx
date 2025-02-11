import { FC } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { ActiveOrders } from '@/widgets/active-orders/ui/ActiveOrders'
import { ShippingTracker } from '@/widgets/shipping-tracker'

export const Home: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onAssistantClick={() => {}} />
      <div className="flex-1 px-4 pt-6 mt-[173px]">
        <div className="space-y-8">
          <ShippingTracker
            supplierName="Prodesco"
            category="Carne"
            commercialName="Carnicería Central"
            deliveryDate="12 Mar"
            totalItems={24}
            estimatedPrice={1250.50}
            currentCard={1}
            totalCards={3}
          />
          <ActiveOrders />
        </div>
      </div>
    </div>
  )
} 