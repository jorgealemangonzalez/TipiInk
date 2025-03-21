import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

interface BackButtonProps {
    className?: string
}

export const BackButton: FC<BackButtonProps> = ({ className }) => {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(-1)}
            className={cn('rounded-full p-2 transition-colors hover:bg-white/10', className)}
        >
            <ArrowLeft className='h-6 w-6 text-white' />
        </button>
    )
}
