import { Heart, Package, Truck } from 'lucide-react'
import React, { FC } from 'react'
import { Book, BookOpen, FileText } from 'react-feather'
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
    className="bg-muted rounded-full pl-1 pr-7 gap-1.5 flex items-center flex-row hover:opacity-80 transition-opacity cursor-pointer h-[60px] shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
    onClick={onClick}
  >
    <div className="min-w-[54px] h-[54px] rounded-full bg-gray-700 flex items-center justify-center">
      {React.cloneElement(icon as React.ReactElement, {
        className: "w-6 h-6 text-primary"
      })}
    </div>
    <div className="flex-1 w-full text-center">
      <p className="text-primary text-sm font-medium leading-tight">{label}</p>
    </div>
  </div>
)

export const Header: FC<HeaderProps> = () => {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <NavigationCard
        icon={<BookOpen />}
        label="Recetas"
        onClick={() => navigate('/recipe-review')}
      />
      <NavigationCard
        icon={<Truck />}
        label="Proveedores"
        onClick={() => navigate('/supplier-management')}
      />
    </div>
  )
} 