import {getSpreadSheetData} from "@/drive/sheets.ts"

export const MainComponent = () => {

    return <div>
        <h1>Main Component</h1>
        <button  className="btn btn-primary" onClick={getSpreadSheetData}>
            Get info
        </button>
    </div>
}
