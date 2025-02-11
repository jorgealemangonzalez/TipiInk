import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { SupplierSelection } from "../features/supplier-selection/ui/SupplierSelection"
import { IncidentsCheck } from "../features/incidents-check/ui/IncidentsCheck"
import { InvoiceUpload } from "../features/invoice-upload/ui/InvoiceUpload"

type Step = "supplier" | "incidents" | "upload"

export function InvoicePage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>("supplier")
  const [selectedSupplier, setSelectedSupplier] = useState<string>("")

  const renderStep = () => {
    switch (currentStep) {
      case "supplier":
        return (
          <SupplierSelection
            selectedSupplier={selectedSupplier}
            onSupplierChange={setSelectedSupplier}
            onContinue={() => setCurrentStep("incidents")}
          />
        )

      case "incidents":
        return (
          <IncidentsCheck
            supplierName={selectedSupplier}
            onContinue={() => setCurrentStep("upload")}
            onBack={() => setCurrentStep("supplier")}
          />
        )

      case "upload":
        return (
          <InvoiceUpload
            supplierName={selectedSupplier}
            onBack={() => setCurrentStep("incidents")}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="bg-gradient-to-b from-black/20 to-transparent">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Validación de Factura</h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {renderStep()}
      </div>
    </div>
  )
} 