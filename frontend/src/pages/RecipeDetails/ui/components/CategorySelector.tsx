import { FC } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const RECIPE_CATEGORIES = ['Arroces', 'Pescados', 'Pasta', 'Carnes', 'Postres', 'Asiático', 'Otros']

interface CategorySelectorProps {
    category?: string
    onCategoryChange: (category: string) => void
}

export const CategorySelector: FC<CategorySelectorProps> = ({ category, onCategoryChange }) => {
    return (
        <Select defaultValue={category} onValueChange={onCategoryChange}>
            <SelectTrigger className='h-6 w-40 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
                <SelectValue placeholder='Seleccionar categoría' className='text-primary/50 italic' />
            </SelectTrigger>
            <SelectContent>
                {RECIPE_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                        {category}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
