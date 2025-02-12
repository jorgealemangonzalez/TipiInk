import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BackButton } from "@/shared/ui/back-button"
import { SupplierSelection } from "../features/supplier-selection/ui/SupplierSelection"
import { IncidentsCheck } from "../features/incidents-check/ui/IncidentsCheck"
import { InvoiceUpload } from "../features/invoice-upload/ui/InvoiceUpload"

type Step = "supplier" | "incidents" | "upload"

export function SupplierManagementPage() {
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
    <div className="min-h-screen">
      <div className="p-4 flex items-center relative">
        <BackButton className="absolute left-4" />
        <h1 className="text-xl font-bold text-white w-full text-center">Gestión de Proveedores</h1>
      </div>
      <div className="px-6">
        {renderStep()}
      </div>
    </div>
  )
} 