import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { SUPPLIERS } from "@/shared/api/mocks/suppliers"

interface InvoiceUploadProps {
  supplierName: string
  onBack: () => void
}

export function InvoiceUpload({ 
  supplierName,
  onBack
}: InvoiceUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [invoiceTotal, setInvoiceTotal] = useState<number | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  const supplier = Object.values(SUPPLIERS).find(s => s.name === supplierName)
  const deliveryNotes = supplier?.deliveryNotes ?? []
  const totalDeliveryNotes = deliveryNotes.reduce((sum, note) => sum + note.total, 0)
  const totalMatch = invoiceTotal !== null && Math.abs(totalDeliveryNotes - invoiceTotal) < 0.01

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)
      setIsVerifying(true)
      setIsVerified(false)
      
      // Simulate OCR process
      // In a real implementation, this would be an API call to your OCR service
      setTimeout(() => {
        // Mock OCR result - In production this would be the actual total extracted from the invoice
        setInvoiceTotal(totalDeliveryNotes) // This matches the total of the delivery notes for demo purposes
        setIsVerifying(false)
        setIsVerified(true)
      }, 2000)
    }
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-white">Albaranes del Periodo</h3>
        <div className="border border-white/40 rounded-lg p-4">
          <Table>
            <TableHeader>
              <TableRow className="border-white/400">
                <TableHead className="text-gray-400">Número</TableHead>
                <TableHead className="text-gray-400">Fecha</TableHead>
                <TableHead className="text-right text-gray-400">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryNotes.map(note => (
                <TableRow key={note.id} className="border-white/40">
                  <TableCell className="text-white">{note.id}</TableCell>
                  <TableCell className="text-white">{note.date}</TableCell>
                  <TableCell className="text-right text-white">{note.total.toFixed(2)}€</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-white/40">
                <TableCell colSpan={2} className="font-bold text-white">Total Albaranes</TableCell>
                <TableCell className="text-right font-bold text-white">{totalDeliveryNotes.toFixed(2)}€</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-6">
        {selectedFile && (
          <Alert 
            variant={isVerifying ? "default" : totalMatch ? "default" : "destructive"}
            className={`border-none ${
              isVerifying 
                ? "bg-blue-900/50" 
                : totalMatch 
                  ? "bg-green-900/50" 
                  : "bg-red-900/50"
            }`}
          >
            {isVerifying ? (
              <>
                <AlertCircle className="h-4 w-4 text-blue-300" />
                <AlertTitle className="text-blue-300">Verificando</AlertTitle>
                <AlertDescription className="text-blue-200">
                  Procesando la factura mediante OCR...
                </AlertDescription>
              </>
            ) : invoiceTotal !== null ? (
              totalMatch ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-300" />
                  <AlertTitle className="text-green-300">Verificación Correcta</AlertTitle>
                  <AlertDescription className="text-green-200">
                    Total detectado: {invoiceTotal.toFixed(2)}€. Los totales de la factura y los albaranes coinciden.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <AlertTitle className="text-red-300">Discrepancia Detectada</AlertTitle>
                  <AlertDescription className="text-red-200">
                    Total detectado: {invoiceTotal.toFixed(2)}€. Hay una diferencia entre el total de la factura y los albaranes.
                  </AlertDescription>
                </>
              )
            ) : null}
          </Alert>
        )}

        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={onBack}
            className="flex-1 border-white/40 bg-white text-black hover:bg-white/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
            <Button 
              className="flex-1 bg-white hover:bg-white/90 text-black"
            >
              Finalizar
            </Button>
        </div>
      </div>
    </>
  )
} 