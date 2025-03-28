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
        className='bg-main-900 hover:bg-main-800 flex items-center gap-3 rounded-2xl p-4 transition-colors'
        aria-label={label}
    >
        <div className='bg-main-800 text-main-400 flex h-10 w-10 items-center justify-center rounded-full'>{icon}</div>
        <div className='text-left'>
            <span className='block font-medium text-white'>{label}</span>
            <span className='text-main-300 text-xs'>Gestionar</span>
        </div>
    </button>
)

export const NavigationButtons: FC = () => {
    return (
        <div className='grid grid-cols-2 gap-3 px-4'>
            <NavigationButton icon={<AlertTriangle className='h-5 w-5' />} label='Incidencias' onClick={() => {}} />
            <NavigationButton icon={<FileText className='h-5 w-5' />} label='Escandallos' onClick={() => {}} />
            <NavigationButton icon={<List className='h-5 w-5' />} label='Productos' onClick={() => {}} />
            <NavigationButton icon={<ShoppingBag className='h-5 w-5' />} label='Factura' onClick={() => {}} />
        </div>
    )
}
