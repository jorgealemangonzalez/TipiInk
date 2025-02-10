import { FC } from 'react'
import { Book, Package, AlertTriangle, FileText } from 'react-feather'

interface HeaderProps {
  onAssistantClick: () => void
}

const NavigationButton: FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="bg-main-900 rounded-2xl p-3 flex flex-col items-center gap-1 hover:bg-main-800 transition-colors">
    <div className="w-12 h-12 rounded-full bg-main-800 flex items-center justify-center text-main-400">
      {icon}
    </div>
    <span className="text-sm text-white">{label}</span>
  </button>
)

export const Header: FC<HeaderProps> = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-main-950 px-4 py-6">
      <div className="grid grid-cols-4 gap-3">
        <NavigationButton
          icon={<Book className="w-6 h-6" />}
          label="Recetario"
        />
        <NavigationButton
          icon={<Package className="w-6 h-6" />}
          label="Productos"
        />
        <NavigationButton
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Incidencias"
        />
        <NavigationButton
          icon={<FileText className="w-6 h-6" />}
          label="Facturas"
        />
      </div>
    </header>
  )
} 