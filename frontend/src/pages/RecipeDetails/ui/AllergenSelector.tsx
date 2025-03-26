import { FC, useState } from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/shared/lib/utils'
import { AllergenIcon } from '@/shared/ui/allergen-icon'
import { Allergen } from '@tipi/shared'

const ALLERGENS = [
    { value: 'gluten' as Allergen, label: 'Gluten' },
    { value: 'crustaceans' as Allergen, label: 'Crustáceos' },
    { value: 'eggs' as Allergen, label: 'Huevos' },
    { value: 'fish' as Allergen, label: 'Pescado' },
    { value: 'peanuts' as Allergen, label: 'Cacahuetes' },
    { value: 'soy' as Allergen, label: 'Soja' },
    { value: 'dairy' as Allergen, label: 'Lácteos' },
    { value: 'nuts' as Allergen, label: 'Frutos secos' },
    { value: 'celery' as Allergen, label: 'Apio' },
    { value: 'mustard' as Allergen, label: 'Mostaza' },
    { value: 'sesame' as Allergen, label: 'Sésamo' },
    { value: 'sulphites' as Allergen, label: 'Sulfitos' },
    { value: 'lupin' as Allergen, label: 'Altramuces' },
    { value: 'molluscs' as Allergen, label: 'Moluscos' },
]

export const AllergenSelector: FC<{
    selected: Allergen[]
    onChange: (values: Allergen[]) => void
}> = ({ selected, onChange }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='flex items-center gap-2'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className='group flex cursor-pointer items-center gap-1 pr-1.5'>
                        {selected.length > 0 ? (
                            <>
                                <div className='flex gap-1'>
                                    {selected.map(allergen => (
                                        <AllergenIcon key={allergen} allergen={allergen} />
                                    ))}
                                </div>
                                <ChevronsUpDown className='h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50' />
                            </>
                        ) : (
                            <>
                                <p className='text-primary/50 text-xs italic'>Sin alérgenos</p>
                                <ChevronsUpDown className='h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50' />
                            </>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent className='w-[280px] p-0' align='end'>
                    <Command>
                        <CommandInput placeholder='Buscar alérgeno...' />
                        <CommandList>
                            <CommandEmpty>No hay coincidencias.</CommandEmpty>
                            <CommandGroup>
                                {ALLERGENS.map(option => {
                                    const isSelected = selected.includes(option.value)
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => {
                                                onChange(
                                                    isSelected
                                                        ? selected.filter(value => value !== option.value)
                                                        : [...selected, option.value],
                                                )
                                                setOpen(true)
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    'border-primary/20 mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                    isSelected ? 'bg-primary' : 'opacity-50',
                                                )}
                                            >
                                                {isSelected && <Check className='text-primary-foreground h-3 w-3' />}
                                            </div>
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
