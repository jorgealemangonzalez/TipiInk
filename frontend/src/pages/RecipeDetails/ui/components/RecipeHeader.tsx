import { FC } from 'react'

import { BookOpen } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { BackButton } from '@/shared/ui/back-button'

interface RecipeHeaderProps {
    recipeName: string
    inMenu: boolean
    onToggleMenu: () => void
}

export const RecipeHeader: FC<RecipeHeaderProps> = ({ recipeName, inMenu, onToggleMenu }) => {
    return (
        <div className='relative flex items-center justify-center'>
            <BackButton className='absolute left-0' />
            <h1 className='text-primary text-2xl font-bold'>{recipeName}</h1>
            <div
                onClick={onToggleMenu}
                className={cn(
                    'absolute right-0 flex cursor-pointer items-center justify-center rounded-full p-2 transition-opacity hover:opacity-80',
                    inMenu ? 'bg-primary' : '',
                )}
            >
                <BookOpen className={cn('h-7 w-7', inMenu ? 'text-black' : 'text-primary')} />
            </div>
        </div>
    )
}
