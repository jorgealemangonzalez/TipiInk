import { useParams } from "react-router-dom"
import { BackButton } from "@/shared/ui/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  AlertTriangle, 
  Package, 
  DollarSign, 
  Phone, 
  Truck, 
  Clock, 
  Calendar,
  Download,
  ExternalLink
} from "lucide-react"
import { SUPPLIERS } from "@/shared/api/mocks/suppliers"
import { Supplier, Invoice, DeliveryNote } from "@/entities/supplier/model/types"
import { FloatingContactButtons } from "../features/contact-buttons"

// Mock data - Replace with real data later
const mockSupplierData: Supplier = {
  id: "1",
  name: "Pescaderia La Central",
  type: "pescaderia",
  totalOrders: 156,
  lastMonthInvoiced: 12500,
  pendingIncidents: 2,
  commercialPhone: "666777888",
  deliveryPhone: "666999000",
  deliveryDays: ["Lunes", "Miércoles", "Viernes"],
  orderAdvanceHours: 24,
  invoices: [
    { id: "INV-001", date: "2024-03-15", total: 2500, status: "paid", pdfUrl: "#" },
    { id: "INV-002", date: "2024-03-01", total: 3200, status: "paid", pdfUrl: "#" },
    { id: "INV-003", date: "2024-02-15", total: 2800, status: "paid", pdfUrl: "#" }
  ],
  deliveryNotes: [
    { id: "ALB-001", date: "2024-03-20", total: 850, hasIncidents: true },
    { id: "ALB-002", date: "2024-03-18", total: 1200, hasIncidents: false },
    { id: "ALB-003", date: "2024-03-15", total: 950, hasIncidents: false, invoiceId: "INV-001" }
  ]
}

export function SupplierDetailsPage() {
  const { supplierId } = useParams()
  // In a real app, we would fetch the supplier data here
  const supplier = mockSupplierData

  const pendingDeliveryNotes = supplier.deliveryNotes.filter(note => !note.invoiceId)

  return (
    <div className="min-h-screen pb-8">
      <div className="p-4 flex items-center relative mb-4">
        <BackButton className="absolute left-4" />
        <h1 className="text-xl font-bold text-white w-full text-center">{supplier.name}</h1>
      </div>
      
      <div className="px-6 space-y-6">
        {/* Delivery Information */}
        <Card className="bg-dark-card-bg border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Información de Reparto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Días de Reparto</h4>
              <div className="flex gap-2 flex-wrap">
                {supplier.deliveryDays.map(day => (
                  <span 
                    key={day}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Antelación Necesaria</h4>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {supplier.orderAdvanceHours} horas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Invoices and Delivery Notes */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="pending" className="flex-1">Albaranes Pendientes</TabsTrigger>
            <TabsTrigger value="invoices" className="flex-1">Histórico Facturas</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="bg-dark-card-bg border-border/40">
              <CardHeader>
                <CardTitle>Albaranes sin Factura ({pendingDeliveryNotes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingDeliveryNotes.map((note) => (
                        <TableRow key={note.id}>
                          <TableCell>{note.id}</TableCell>
                          <TableCell>{new Date(note.date).toLocaleDateString()}</TableCell>
                          <TableCell>{note.total.toLocaleString()}€</TableCell>
                          <TableCell>
                            {note.hasIncidents && (
                              <span className="flex items-center gap-1 text-destructive">
                                <AlertTriangle className="w-4 h-4" />
                                Incidencia
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="bg-dark-card-bg border-border/40">
              <CardHeader>
                <CardTitle>Histórico de Facturas</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplier.invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.id}</TableCell>
                          <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                          <TableCell>{invoice.total.toLocaleString()}€</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              invoice.status === 'paid' 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {invoice.pdfUrl && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => window.open(invoice.pdfUrl, '_blank')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline"
            className="w-full bg-primary hover:bg-primary/90 text-black"
            size="lg"
          >
            <FileText className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>

          <Button 
            variant="outline"
            className="w-full bg-primary hover:bg-primary/90 text-black"
            size="lg"
          >
            <Package className="w-4 h-4 mr-2" />
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Floating Contact Buttons */}
      <FloatingContactButtons
        commercialPhone={supplier.commercialPhone}
        deliveryPhone={supplier.deliveryPhone}
      />
    </div>
  )
} 