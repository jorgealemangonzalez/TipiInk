import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Incident {
  id: string
  description: string
  date: string
  status: "pending" | "resolved"
  type: "albaran_missing" | "amount_correction" | "delivery_compensation"
}

interface IncidentsCheckProps {
  supplierName: string
  onContinue: () => void
  onBack: () => void
}

export function IncidentsCheck({ 
  supplierName,
  onContinue,
  onBack
}: IncidentsCheckProps) {
  // Mock data - This would come from your backend
  const getSupplierIncidents = (supplier: string): Incident[] => {
    switch (supplier) {
      case "Pescaderia La Central":
        return [
          {
            id: "INC-001",
            description: "Albarán ALB-2024-089 pendiente de recibir",
            date: "2024-03-20",
            status: "pending",
            type: "albaran_missing"
          },
          {
            id: "INC-002",
            description: "Pendiente de cambio de importe en albarán ALB-2024-092",
            date: "2024-03-21",
            status: "resolved",
            type: "amount_correction"
          }
        ]
      case "Fruteria El Huertano":
        return [
          {
            id: "INC-003",
            description: "Pendiente de acordar compensación por deficiencia en entrega ALB-2024-095",
            date: "2024-03-22",
            status: "pending",
            type: "delivery_compensation"
          }
        ]
      case "Carniceria Paco":
        return []
      default:
        return []
    }
  }

  const incidents = getSupplierIncidents(supplierName)
  const hasIncidents = incidents.some(incident => incident.status === "pending")

  const getIncidentTypeText = (type: Incident["type"]) => {
    switch (type) {
      case "albaran_missing":
        return "Albarán por corregir no recibido"
      case "amount_correction":
        return "Pendiente de cambio de importe en albarán"
      case "delivery_compensation":
        return "Pendiente de acordar compensación por deficiencia en entrega"
    }
  }

  return (
    <Card className="border border-white/40 bg-transparent shadow-none p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Comprobación de Incidencias</h2>
      <p className="text-gray-400 mb-6">
      </p>

      {hasIncidents ? (
        <Alert variant="destructive" className="mb-6 border-none bg-red-900/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-red-300">Incidencias Pendientes</AlertTitle>
          <AlertDescription className="text-red-200">
            Existen incidencias pendientes que deben ser resueltas antes de procesar la factura
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6 border-none bg-green-900/50">
          <CheckCircle2 className="h-4 w-4 text-green-300" />
          <AlertTitle className="text-green-300">Sin Incidencias</AlertTitle>
          <AlertDescription className="text-green-200">
            No hay incidencias pendientes para este proveedor
          </AlertDescription>
        </Alert>
      )}

      {incidents.map(incident => (
        <div 
          key={incident.id} 
          className="border border-white/40 bg-transparent p-4 rounded-lg mb-4"
        >
          <p className="font-medium text-white mb-3">{incident.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Fecha: {incident.date}</p>
            <span className={`text-sm px-2 py-1 rounded ${
              incident.status === "pending" 
                ? "bg-red-900/50 text-red-300" 
                : "bg-green-900/50 text-green-300"
            }`}>
              {incident.status === "pending" ? "Pendiente" : "Resuelto"}
            </span>
          </div>
        </div>
      ))}

      <div className="flex gap-4 mt-6">
        <Button 
          variant="outline"
          onClick={onBack}
          className="flex-1 border-white/40 bg-white text-black hover:bg-white/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Button 
          onClick={onContinue}
          className="flex-1 bg-white hover:bg-white/90 text-black"
          disabled={hasIncidents}
        >
          Continuar
        </Button>
      </div>
    </Card>
  )
} 