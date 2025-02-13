import { useParams } from "react-router-dom"
import { useSupplier } from "@/entities/supplier/model/hooks"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/shared/ui/back-button"

export function InvoiceSummaryPage() {
  const { supplierId } = useParams()
  const supplier = useSupplier(supplierId ?? "")

  if (!supplier) {
    return <div>Supplier not found</div>
  }

  const pendingDeliveryNotes = supplier.deliveryNotes.filter(note => !note.invoiceId)
  const totalAmount = pendingDeliveryNotes.reduce((acc, note) => acc + note.total, 0)

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="pb-6 flex items-center relative">
        <BackButton className="absolute" />
        <h1 className="text-xl font-bold text-white w-full text-center">Resumen de Albaranes</h1>
      </div>

      <div className="flex-1 space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Albaranes Pendientes</h3>
          
          <div className="space-y-4">
            {pendingDeliveryNotes.map((note) => (
              <Card key={note.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{note.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      Fecha: {new Date(note.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {note.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold">
                {totalAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-6">
        <Button 
          className="w-full"
        >
          Subir Factura
        </Button>
      </div>
    </div>
  )
} 