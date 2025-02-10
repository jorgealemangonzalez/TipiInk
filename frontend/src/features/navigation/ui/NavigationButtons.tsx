import { FC } from 'react'
import { AlertTriangle, FileText, List, ShoppingBag } from 'react-feather'

interface NavigationButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

const NavigationButton: FC<NavigationButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-main-900 rounded-2xl p-4 flex items-center gap-3 hover:bg-main-800 transition-colors"
    aria-label={label}
  >
    <div className="w-10 h-10 rounded-full bg-main-800 flex items-center justify-center text-main-400">
      {icon}
    </div>
    <div className="text-left">
      <span className="text-white font-medium block">{label}</span>
      <span className="text-xs text-main-300">Gestionar</span>
    </div>
  </button>
)

export const NavigationButtons: FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      <NavigationButton
        icon={<AlertTriangle className="w-5 h-5" />}
        label="Incidencias"
        onClick={() => {}}
      />
      <NavigationButton
        icon={<FileText className="w-5 h-5" />}
        label="Escandallos"
        onClick={() => {}}
      />
      <NavigationButton
        icon={<List className="w-5 h-5" />}
        label="Productos"
        onClick={() => {}}
      />
      <NavigationButton
        icon={<ShoppingBag className="w-5 h-5" />}
        label="Factura"
        onClick={() => {}}
      />
    </div>
  )
} 