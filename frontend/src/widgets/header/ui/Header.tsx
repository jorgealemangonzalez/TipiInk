import React, { FC } from 'react'
import { BookOpen } from 'react-feather'
import { useNavigate } from 'react-router-dom'

import { Truck } from 'lucide-react'

interface HeaderProps {
    onAssistantClick: () => void
}

const NavigationCard: FC<{
    icon: React.ReactNode
    label: string
    onClick?: () => void
}> = ({ icon, label, onClick }) => (
    <div
        className='flex h-[60px] cursor-pointer flex-row items-center gap-1.5 rounded-full bg-muted pl-1 pr-7 shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-80'
        onClick={onClick}
    >
        <div className='flex h-[54px] min-w-[54px] items-center justify-center rounded-full bg-gray-700'>
            {React.cloneElement(icon as React.ReactElement, {
                className: 'w-6 h-6 text-primary',
            })}
        </div>
        <div className='w-full flex-1 text-center'>
            <p className='text-sm font-medium leading-tight text-primary'>{label}</p>
        </div>
    </div>
)

export const Header: FC<HeaderProps> = () => {
    const navigate = useNavigate()

    return (
        <div className='grid grid-cols-2 gap-4 p-4'>
            <NavigationCard icon={<BookOpen />} label='Recetas' onClick={() => navigate('/recipes')} />
            <NavigationCard icon={<Truck />} label='Proveedores' onClick={() => navigate('/supplier-management')} />
        </div>
    )
}
