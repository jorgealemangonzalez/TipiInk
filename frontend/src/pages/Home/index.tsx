import { ShippingTracker } from "@/widgets/shipping-tracker"

export function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <ShippingTracker
        id="JOG45124"
        origin="Jakarta Timur"
        destination="Yogyakarta"
        departureDate="6 Dec 2022"
        estimatedArrival="9 Dec 2022"
        status="transit"
        className="max-w-xl mx-auto"
      />
    </div>
  )
} 