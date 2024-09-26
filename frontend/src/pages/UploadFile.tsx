import { useState, useEffect } from 'react'
import { Camera, FileText, ChevronDown, ChevronUp, ArrowLeft, Eye, X, ZoomIn, ZoomOut, Check, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Item {
    articulo: string
    cantidad: number
    precio: number
    tipoIVA: number
    total: number
}

interface AlbaranData {
    proveedor: string
    serie: string
    items: Item[]
    subtotal: number
    totalIVA: number
    total: number
}

interface Albaran {
    numero: string
    total: number
}

interface FacturaData {
    numero: string
    proveedor: string
    fecha: string
    total: number
    albaranes: Albaran[]
    albaranesListados: string[]
}

export function UploadFilePage() {
    const [activeScreen, setActiveScreen] = useState('main')
    const [isHistorialExpanded, setIsHistorialExpanded] = useState(false)
    const [showImagePopup, setShowImagePopup] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)

    const [albaranData, setAlbaranData] = useState<AlbaranData>({
        proveedor: 'Julian',
        serie: '123-1245',
        items: [
            { articulo: 'Anchoas', cantidad: 2, precio: 10, tipoIVA: 10, total: 20 },
            { articulo: 'Queso', cantidad: 4, precio: 5, tipoIVA: 5, total: 20 },
            { articulo: 'Atun', cantidad: 2, precio: 5, tipoIVA: 21, total: 10 },
        ],
        subtotal: 50,
        totalIVA: 6.5,
        total: 56.5,
    })

    const [facturaData, setFacturaData] = useState<FacturaData>({
        numero: 'FAC-001',
        proveedor: 'Proveedor A',
        fecha: '2023-05-25',
        total: 200,
        albaranes: [
            { numero: 'ALB-001', total: 95 },
            { numero: 'ALB-002', total: 105 },
        ],
        albaranesListados: ['ALB-001', 'ALB-002', 'ALB-003']
    })

    const [totalAlbaranes, setTotalAlbaranes] = useState(0)
    const [totalesCoinciden, setTotalesCoinciden] = useState(false)
    const [albaranesCoinciden, setAlbaranesCoinciden] = useState(false)
    const [albaranesFaltantes, setAlbaranesFaltantes] = useState<string[]>([])
    const [albaranesNoListados, setAlbaranesNoListados] = useState<string[]>([])

    useEffect(() => {
        const nuevoTotal = facturaData.albaranes.reduce((sum, albaran) => sum + albaran.total, 0)
        setTotalAlbaranes(nuevoTotal)
        setTotalesCoinciden(nuevoTotal === facturaData.total)

        const albaranesRegistrados = new Set(facturaData.albaranes.map(a => a.numero))
        const albaranesListados = new Set(facturaData.albaranesListados)

        const faltantes = [...albaranesListados].filter(x => !albaranesRegistrados.has(x))
        const noListados = [...albaranesRegistrados].filter(x => !albaranesListados.has(x))

        setAlbaranesFaltantes(faltantes)
        setAlbaranesNoListados(noListados)
        setAlbaranesCoinciden(faltantes.length === 0 && noListados.length === 0)
    }, [facturaData])

    const handleAlbaranInputChange = (field: keyof AlbaranData, value: string) => {
        setAlbaranData(prev => ({ ...prev, [field]: value }))
    }

    const handleAlbaranItemChange = (index: number, field: keyof Item, value: string) => {
        const newItems = [...albaranData.items]
        newItems[index] = {
            ...newItems[index],
            [field]: field === 'articulo' ? value : parseFloat(value) || 0
        }
        newItems[index].total = newItems[index].cantidad * newItems[index].precio * (1 + newItems[index].tipoIVA / 100)

        const subtotal = newItems.reduce((sum, item) => sum + (item.cantidad * item.precio), 0)
        const totalIVA = newItems.reduce((sum, item) => sum + (item.cantidad * item.precio * item.tipoIVA / 100), 0)
        const total = subtotal + totalIVA

        setAlbaranData(prev => ({
            ...prev,
            items: newItems,
            subtotal,
            totalIVA,
            total,
        }))
    }

    const handleFacturaInputChange = (field: keyof FacturaData, value: string) => {
        setFacturaData(prev => ({ ...prev, [field]: field === 'total' ? parseFloat(value) : value }))
    }

    const handleValidarFactura = () => {
        console.log('Factura validada')
        // Aquí iría la lógica para validar la factura
    }

    const handleFlagFactura = () => {
        console.log('Factura marcada para verificación manual')
        // Aquí iría la lógica para marcar la factura para verificación manual
    }

    const handleImageUpload = (screen: 'albaran' | 'facturas') => {
        // Simulating image upload
        console.log(`Uploading image for ${screen}`)
        setUploadedImage('/placeholder.svg?height=600&width=800')
        // Here you would typically handle the actual image upload and OCR processing
        // For now, we'll just set the active screen
        setActiveScreen(screen)
    }

    const renderScreen = () => {
        switch (activeScreen) {
        case 'main':
            return <MainScreen setActiveScreen={setActiveScreen} isHistorialExpanded={isHistorialExpanded} setIsHistorialExpanded={setIsHistorialExpanded} handleImageUpload={handleImageUpload} />
        case 'albaran':
            return <AlbaranScreen setActiveScreen={setActiveScreen} albaranData={albaranData} handleInputChange={handleAlbaranInputChange} handleItemChange={handleAlbaranItemChange} setShowImagePopup={setShowImagePopup} uploadedImage={uploadedImage} />
        case 'facturas':
            return <FacturasScreen setActiveScreen={setActiveScreen} facturaData={facturaData} handleInputChange={handleFacturaInputChange} totalAlbaranes={totalAlbaranes} totalesCoinciden={totalesCoinciden} albaranesCoinciden={albaranesCoinciden} handleValidarFactura={handleValidarFactura} handleFlagFactura={handleFlagFactura} albaranesFaltantes={albaranesFaltantes} albaranesNoListados={albaranesNoListados} uploadedImage={uploadedImage} />
        default:
            return <MainScreen setActiveScreen={setActiveScreen} isHistorialExpanded={isHistorialExpanded} setIsHistorialExpanded={setIsHistorialExpanded} handleImageUpload={handleImageUpload} />
        }
    }

    return (
        <div className="bg-gradient-to-br from-[#effcfc] to-[#b7e9f7] text-[#12323a]">
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO-hhkB6HCDzvTSyGj36qPalMg4kGkHY0.png')",
                    backgroundSize: "30%",
                    backgroundPosition: "center",
                    backgroundRepeat: "repeat"
                }}
            />
            <div className="relative z-10 p-6 min-h-screen flex flex-col">
                {renderScreen()}
            </div>
            <Dialog open={showImagePopup} onOpenChange={setShowImagePopup}>
                <DialogContent className="max-w-3xl">
                    <div className="relative">
                        <img
                            src={uploadedImage || "/placeholder.svg?height=600&width=800"}
                            alt="Documento"
                            className="w-full h-auto"
                            style={{ transform: `scale(${zoomLevel})` }}
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <Button size="sm" variant="secondary" onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 3))}>
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}>
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <Button onClick={() => setShowImagePopup(false)} className="absolute top-2 right-2" variant="ghost">
                        <X className="h-4 w-4" />
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function MainScreen({ setActiveScreen, isHistorialExpanded, setIsHistorialExpanded, handleImageUpload }: { setActiveScreen: (screen: string) => void, isHistorialExpanded: boolean, setIsHistorialExpanded: (expanded: boolean) => void, handleImageUpload: (screen: 'albaran' | 'facturas') => void }) {
    return (
        <>
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 ring-2 ring-[#3fc1c9] ring-offset-2">
                        <AvatarImage src="/placeholder.svg?height=64&width=64" />
                        <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-semibold text-[#3F7CC9]">Bienvenido,</h2>
                        <h1 className="text-3xl font-bold text-[#12323a]">Usuario TIPI</h1>
                    </div>
                </div>
            </div>
            <div className="flex-grow flex flex-col justify-center">
                <div className="flex w-full gap-8">
                    <Button
                        onClick={() => handleImageUpload('facturas')}
                        className="flex-1 h-fit p-8 text-xl bg-gradient-to-br from-[#3FC98C] to-[#3F7CC9] hover:from-[#3F7CC9] hover:to-[#3FC98C] text-white rounded-3xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 flex flex-col items-center justify-center space-y-4"
                    >
                        <FileText className="size-16" />
                        <span className="font-semibold">Facturas</span>
                    </Button>
                    <Button
                        onClick={() => handleImageUpload('albaran')}
                        className="flex-1 h-fit p-8 text-xl bg-gradient-to-br from-[#3fc1c9] to-[#3F7CC9] hover:from-[#3F7CC9] hover:to-[#3fc1c9] text-white rounded-3xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 flex flex-col items-center justify-center space-y-4"
                    >
                        <Camera className="size-16" />
                        <span className="font-semibold">Albarán</span>
                    </Button>
                </div>
            </div>
            <Card className="bg-white bg-opacity-90 mt-auto shadow-xl">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-[#12323a] flex items-center">
                                Historial
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsHistorialExpanded(!isHistorialExpanded)}
                            className="text-[#12323a] hover:bg-[#3fc1c9] hover:text-white transition-colors duration-200"
                        >
                            {isHistorialExpanded ? <ChevronDown className="h-6 w-6" /> : <ChevronUp className="h-6 w-6" />}
                        </Button>
                    </div>
                    {isHistorialExpanded ? (
                        <ScrollArea className="h-64">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="mb-4 p-4 bg-gradient-to-r from-[#b7f0fe] to-[#d8f8ff] rounded-lg shadow transition-all duration-200 hover:shadow-md">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-[#12323a] flex items-center">
                                            <FileText className="mr-2 h-4 w-4 text-[#3F7CC9]" />
                                                        Factura #{1000 + i}
                                        </p>
                                        <p className="text-sm text-[#3F7CC9]">
                                            {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    ) : (
                        <div className="p-4 bg-gradient-to-r from-[#b7f0fe] to-[#d8f8ff] rounded-lg shadow transition-all duration-200 hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-[#12323a] flex items-center">
                                    <FileText className="mr-2 h-4 w-4 text-[#3F7CC9]" />
                                            Factura #1000
                                </p>
                                <p className="text-sm text-[#3F7CC9]">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

function AlbaranScreen({ setActiveScreen, albaranData, handleInputChange, handleItemChange, setShowImagePopup, uploadedImage }: { setActiveScreen: (screen: string) => void, albaranData: AlbaranData, handleInputChange: (field: keyof AlbaranData, value: string) => void, handleItemChange: (index: number, field: keyof Item, value: string) => void, setShowImagePopup: (show: boolean) => void, uploadedImage: string | null }) {
    return (
        <div className="h-full flex flex-col">
            <Button onClick={() => setActiveScreen('main')} variant="ghost" className="mb-4 text-[#12323a] self-start hover:bg-[#3fc1c9] hover:text-white transition-colors duration-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
            </Button>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-[#12323a]">Datos del Albarán</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium text-[#12323a]">Proveedor</label>
                        <Input
                            value={albaranData.proveedor}
                            onChange={(e) => handleInputChange('proveedor', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-[#12323a]">Nº Serie</label>
                        <Input
                            value={albaranData.serie}
                            onChange={(e) => handleInputChange('serie', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Artículo</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Tipo de IVA</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {albaranData.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            value={item.articulo}
                                            onChange={(e) => handleItemChange(index, 'articulo', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.cantidad}
                                            onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.precio}
                                            onChange={(e) => handleItemChange(index, 'precio', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={item.tipoIVA.toString()}
                                            onValueChange={(value) => handleItemChange(index, 'tipoIVA', value)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Seleccionar IVA" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">0%</SelectItem>
                                                <SelectItem value="5">5%</SelectItem>
                                                <SelectItem value="10">10%</SelectItem>
                                                <SelectItem value="21">21%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{item.total.toFixed(2)}€</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-end">
                        <span className="font-medium mr-4">Subtotal:</span>
                        <span>{albaranData.subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-end">
                        <span className="font-medium mr-4">Total IVA:</span>
                        <span>{albaranData.totalIVA.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-end text-lg font-bold">
                        <span className="mr-4">Total:</span>
                        <span>{albaranData.total.toFixed(2)}€</span>
                    </div>
                </div>
            </div>
            <Button
                onClick={() => setShowImagePopup(true)}
                className="mt-6 bg-[#3fc1c9] hover:bg-[#3F7CC9] text-white self-center px-8 py-4 text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <Eye className="mr-2 h-6 w-6" />
                    Ver Imagen del Albarán
            </Button>
        </div>
    )
}

function FacturasScreen({ setActiveScreen, facturaData, handleInputChange, totalAlbaranes, totalesCoinciden, albaranesCoinciden, handleValidarFactura, handleFlagFactura, albaranesFaltantes, albaranesNoListados, uploadedImage }: { setActiveScreen: (screen: string) => void, facturaData: FacturaData, handleInputChange: (field: keyof FacturaData, value: string) => void, totalAlbaranes: number, totalesCoinciden: boolean, albaranesCoinciden: boolean, handleValidarFactura: () => void, handleFlagFactura: () => void, albaranesFaltantes: string[], albaranesNoListados: string[], uploadedImage: string | null }) {
    return (
        <div className="h-full flex flex-col">
            <Button onClick={() => setActiveScreen('main')} variant="ghost" className="mb-4 text-[#12323a] self-start hover:bg-[#3fc1c9] hover:text-white transition-colors duration-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
            </Button>
            <h2 className="text-3xl font-bold mb-6 text-[#12323a]">Verificación de Factura</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium text-[#12323a]">Número de Factura</label>
                        <Input
                            value={facturaData.numero}
                            onChange={(e) => handleInputChange('numero', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-[#12323a]">Proveedor</label>
                        <Input
                            value={facturaData.proveedor}
                            onChange={(e) => handleInputChange('proveedor', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-[#12323a]">Fecha</label>
                        <Input
                            type="date"
                            value={facturaData.fecha}
                            onChange={(e) => handleInputChange('fecha', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-[#12323a]">Total Factura</label>
                        <Input
                            type="number"
                            value={facturaData.total}
                            onChange={(e) => handleInputChange('total', e.target.value)}
                            className="mt-1"
                        />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Albaranes Asociados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Número de Albarán</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {facturaData.albaranes.map((albaran, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{albaran.numero}</TableCell>
                                        <TableCell>{albaran.total}€</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-4">
                <Alert variant={totalesCoinciden ? "default" : "destructive"}>
                    <AlertTitle>Verificación de Totales</AlertTitle>
                    <AlertDescription>
                            Total Factura: {facturaData.total}€<br />
                            Total Albaranes: {totalAlbaranes}€<br />
                        {totalesCoinciden ? "Los totales coinciden" : "Hay una discrepancia en los totales"}
                    </AlertDescription>
                </Alert>
                <Alert variant={albaranesCoinciden ? "default" : "destructive"}>
                    <AlertTitle>Verificación de Albaranes</AlertTitle>
                    <AlertDescription>
                        {albaranesCoinciden
                            ? "Todos los albaranes listados están registrados y coinciden"
                            : (
                                <>
                                    <p>Hay discrepancias entre los albaranes listados y los registrados:</p>
                                    {albaranesFaltantes.length > 0 && (
                                        <p>Albaranes faltantes: {albaranesFaltantes.join(', ')}</p>
                                    )}
                                    {albaranesNoListados.length > 0 && (
                                        <p className="text-red-500">Albaranes no listados en la factura: {albaranesNoListados.join(', ')}</p>
                                    )}
                                </>
                            )
                        }
                    </AlertDescription>
                </Alert>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <Button
                    onClick={handleValidarFactura}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled={!totalesCoinciden || !albaranesCoinciden}
                >
                    <Check className="mr-2 h-4 w-4" />
                        Validar Factura
                </Button>
                <Button
                    onClick={handleFlagFactura}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                        Marcar para Verificación Manual
                </Button>
            </div>
        </div>
    )
}
