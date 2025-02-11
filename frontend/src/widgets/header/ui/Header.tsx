import React, { FC } from 'react'
import { Book, Package, AlertTriangle, FileText } from 'react-feather'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  onAssistantClick: () => void
}

const NavigationCard: FC<{ 
  icon: React.ReactNode
  label: string
  onClick?: () => void
}> = ({ icon, label, onClick }) => (
  <div 
    className="bg-dark-card-bg rounded-full pl-1 pr-7 flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer h-[69px] shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
    onClick={onClick}
  >
    <div className="w-[60px] h-[60px] rounded-full bg-gray-700 flex items-center justify-center">
      {React.cloneElement(icon as React.ReactElement, {
        className: "w-7 h-7 text-primary"
      })}
    </div>
    <div className="flex-1">
      <p className="text-primary text-[16px] font-medium leading-tight">{label}</p>
    </div>
  </div>
)

export const Header: FC<HeaderProps> = () => {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <NavigationCard
        icon={<Book />}
        label="Recetario"
        onClick={() => navigate('/recipe-review')}
      />
      <NavigationCard
        icon={<Package />}
        label="Productos"
      />
      <NavigationCard
        icon={<AlertTriangle />}
        label="Incidencias"
      />
      <NavigationCard
        icon={<FileText />}
        label="Facturas"
      />
    </div>
  )
} 