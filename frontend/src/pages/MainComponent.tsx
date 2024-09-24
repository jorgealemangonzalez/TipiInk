import {getSpreadSheetData, updateSpreadsheetData} from "@/drive/sheets.ts"
import {extractInvoice} from "@/api/clients.ts"

export const MainComponent = () => {

    return <div>
        <h1>Main Component</h1>
        <button  className="btn btn-primary" onClick={getSpreadSheetData}>
            GUARDAR AHORA
        </button>
        <button className="btn btn-primary" onClick={() => updateSpreadsheetData('18-OCT!E9:E9', '60')}>
            CAMBIAR DATOS
        </button>
        <button className="btn btn-primary" onClick={() => extractInvoice().then(console.log)}>
            EXTRACT FROM IMAGE
        </button>
    </div>
}
