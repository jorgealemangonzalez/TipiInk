import { useParams, useNavigate } from "react-router-dom"
import { useSupplier } from "@/entities/supplier/model/hooks"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { BackButton } from "@/shared/ui/back-button"

export function AddInvoicePage() {
  const { supplierId } = useParams()
  const navigate = useNavigate()
  const supplier = useSupplier(supplierId ?? "")

  if (!supplier) {
    return <div>Supplier not found</div>
  }

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="pb-6 flex items-center relative">
        <BackButton className="absolute" />
        <h1 className="text-xl font-bold text-white w-full text-center">Nueva factura</h1>
      </div>

      <div className="flex-1 space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Comprobación de Incidencias</h3>
          
          {supplier.pendingIncidents > 0 ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Incidencias Pendientes</AlertTitle>
              <AlertDescription>
                Existen incidencias pendientes que deben ser resueltas antes de procesar la factura
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-4">
            {supplier.deliveryNotes?.filter(note => !note.invoiceId).map((note) => (
              <Card key={note.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{note.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      Fecha: {new Date(note.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      note.hasIncidents ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-700"
                    }`}>
                      {note.hasIncidents ? "Pendiente" : "Resuelto"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      <div className="sticky bottom-6">
        <Button 
          className="w-full"
          onClick={() => navigate(`/supplier-management/${supplierId}/addInvoice/summary`)}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
} 