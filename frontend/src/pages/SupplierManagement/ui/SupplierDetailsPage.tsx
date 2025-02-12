import { useParams } from "react-router-dom"
import { BackButton } from "@/shared/ui/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

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
    { 
      id: "ALB-001", 
      date: "2024-03-20", 
      total: 850, 
      hasIncidents: true,
      incidentDetails: {
        description: "Producto en mal estado",
        affectedItems: ["Lubina - 2kg", "Mejillones - 1kg"],
        reportDate: "2024-03-20",
        status: "pending"
      }
    },
    { id: "ALB-002", date: "2024-03-18", total: 1200, hasIncidents: false },
    { id: "ALB-003", date: "2024-03-15", total: 950, hasIncidents: false, invoiceId: "INV-001" }
  ]
}

type DeliveryInfoProps = {
  deliveryDays: string[]
  orderAdvanceHours: number
}

function DeliveryInfo({ deliveryDays, orderAdvanceHours }: DeliveryInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-1">Días de Reparto</h4>
        <div className="flex gap-2 flex-wrap">
          {deliveryDays.map(day => (
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
        <h4 className="text-sm font-medium text-gray-400 mb-1">Antelación</h4>
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {orderAdvanceHours} horas
        </p>
      </div>
    </div>
  )
}

type IncidentDialogProps = {
  incidentDetails: {
    description: string
    affectedItems: string[]
    reportDate: string
    status: string
  }
  noteId: string
}

function IncidentDialog({ incidentDetails, noteId }: IncidentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Incidencia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Detalles de la Incidencia
          </DialogTitle>
          <DialogDescription>
            Información sobre la incidencia reportada en el albarán {noteId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-400">
              Fecha
            </Label>
            <div className="col-span-3">
              {new Date(incidentDetails.reportDate).toLocaleDateString()}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-gray-400">
              Descripción
            </Label>
            <div className="col-span-3">
              {incidentDetails.description}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-gray-400">
              Productos
            </Label>
            <div className="col-span-3">
              <ul className="list-disc pl-4 space-y-1">
                {incidentDetails.affectedItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-400">
              Estado
            </Label>
            <div className="col-span-3">
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
                Pendiente de resolución
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline">Marcar como resuelto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type PendingDeliveryNotesTableProps = {
  deliveryNotes: Supplier['deliveryNotes']
}

function PendingDeliveryNotesTable({ deliveryNotes }: PendingDeliveryNotesTableProps) {
  const pendingDeliveryNotes = deliveryNotes.filter(note => !note.invoiceId)

  if (pendingDeliveryNotes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay albaranes pendientes
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1">
        {pendingDeliveryNotes.map((note, index) => (
          <div key={note.id}>
            <div className="bg-background py-4 px-2 flex items-center justify-between hover:bg-gray-700/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{note.id}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-lg font-semibold">{note.total.toLocaleString()}€</p>
              </div>
              {note.hasIncidents && note.incidentDetails && (
                <IncidentDialog 
                  incidentDetails={note.incidentDetails}
                  noteId={note.id}
                />
              )}
            </div>
            {index < pendingDeliveryNotes.length - 1 && (
              <Separator className="bg-gray-700/50" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

type InvoicesTableProps = {
  invoices: Supplier['invoices']
}

function InvoicesTable({ invoices }: InvoicesTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay facturas disponibles
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1">
        {invoices.map((invoice, index) => (
          <div key={invoice.id}>
            <div className="py-4 px-2 flex items-center justify-between hover:bg-gray-700/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{invoice.id}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(invoice.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{invoice.total.toLocaleString()}€</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    invoice.status === 'paid' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
                  </span>
                </div>
              </div>
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
            </div>
            {index < invoices.length - 1 && (
              <Separator className="bg-gray-700/50" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

type DocumentsTabsProps = {
  deliveryNotes: Supplier['deliveryNotes']
  invoices: Supplier['invoices']
}

function DocumentsTabs({ deliveryNotes, invoices }: DocumentsTabsProps) {
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="w-full grid grid-cols-2 mb-4">
        <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-black">
          Albaranes
        </TabsTrigger>
        <TabsTrigger value="invoices" className="data-[state=active]:bg-primary data-[state=active]:text-black">
          Facturas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <div className="p-2">
          <PendingDeliveryNotesTable deliveryNotes={deliveryNotes} />
        </div>
      </TabsContent>

      <TabsContent value="invoices" className="mt-0">
        <div className="">
          <InvoicesTable invoices={invoices} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

function ActionButtons() {
  return (
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
  )
}

export function SupplierDetailsPage() {
  const { supplierId } = useParams()
  // In a real app, we would fetch the supplier data here
  const supplier = mockSupplierData

  return (
    <div className="flex flex-col justify-between p-6">
      <div className="flex items-center justify-center mb-6">
        <BackButton className="absolute left-4" />
        <h1 className="text-xl font-bold text-white text-center flex-1">{supplier.name}</h1>
        <div className="absolute right-4">
          <FloatingContactButtons
            commercialPhone={supplier.commercialPhone}
            deliveryPhone={supplier.deliveryPhone}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Información de Reparto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryInfo 
              deliveryDays={supplier.deliveryDays}
              orderAdvanceHours={supplier.orderAdvanceHours}
            />
          </CardContent>
        </Card>

        <DocumentsTabs 
          deliveryNotes={supplier.deliveryNotes}
          invoices={supplier.invoices}
        />

      </div>

      <ActionButtons />
    </div>
  )
} 