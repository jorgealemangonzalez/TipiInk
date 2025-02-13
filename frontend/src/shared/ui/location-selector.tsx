import { FC } from 'react'
import { Location } from '@/entities/recipe/model/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/shared/lib/utils'

interface LocationSelectorProps {
  value: Location
  onChange: (value: Location) => void
}

export const LocationSelector: FC<LocationSelectorProps> = ({ value, onChange }) => {
  const locations: { value: Location, label: string }[] = [
    { value: 'ibiza', label: 'Ibiza' },
    { value: 'japon', label: 'Japón' },
    { value: 'bahamas', label: 'Bahamas' }
  ]

  return (
    <Select value={value} onValueChange={onChange as (value: string) => void}>
      <SelectTrigger className="bg-gray-800 border-gray-700 text-primary hover:bg-gray-700/50">
        <SelectValue placeholder="Ubicación" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700">
        {locations.map((location) => (
          <SelectItem 
            key={location.value} 
            value={location.value}
            className={cn(
              "text-primary hover:bg-gray-700 focus:bg-gray-700 cursor-pointer",
              value === location.value && "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90"
            )}
          >
            {location.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 