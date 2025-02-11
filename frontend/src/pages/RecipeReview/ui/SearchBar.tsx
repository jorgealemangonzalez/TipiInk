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
    <div className="relative flex items-center justify-end">
      <div
        className={cn(
          "flex items-center transition-all duration-300",
          isExpanded ? "w-full" : "w-[60px]"
        )}
      >
        {isExpanded && (
          <input
            type="text"
            className="w-full h-[60px] pl-4 pr-[60px] rounded-full bg-gray-700 text-primary placeholder-gray-400 focus:outline-none"
            placeholder={placeholder}
            onChange={(e) => onSearch(e.target.value)}
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
            "flex items-center justify-center w-[60px] h-[60px] rounded-full bg-gray-700",
            isExpanded ? "absolute right-0" : ""
          )}
        >
          <Search className="h-7 w-7 text-primary" />
        </button>
      </div>
    </div>
  )
} 