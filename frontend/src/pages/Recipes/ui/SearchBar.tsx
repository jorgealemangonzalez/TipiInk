import { FC, useState } from 'react'

import { Search } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
}

export const SearchBar: FC<SearchBarProps> = ({ onSearch, placeholder = 'Por plato o ingrediente...' }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className='relative flex items-center justify-end'>
            <div className={cn('flex items-center transition-all duration-300', isExpanded ? 'w-full' : 'w-[60px]')}>
                {isExpanded && (
                    <input
                        type='text'
                        className='h-[60px] w-full rounded-full border border-gray-700 bg-gray-700 pl-4 pr-[60px] text-white placeholder-gray-400 focus:outline-none'
                        placeholder={placeholder}
                        onChange={e => onSearch(e.target.value)}
                        autoFocus
                    />
                )}
                <button
                    onClick={() => {
                        if (!isExpanded) {
                            setIsExpanded(true)
                        } else {
                            setIsExpanded(false)
                            onSearch('')
                        }
                    }}
                    className={cn(
                        'flex h-[60px] w-[60px] items-center justify-center rounded-full',
                        isExpanded ? 'absolute right-0 border-l border-gray-700 bg-gray-700' : '',
                    )}
                >
                    <Search className='h-7 w-7 text-white' />
                </button>
            </div>
        </div>
    )
}
