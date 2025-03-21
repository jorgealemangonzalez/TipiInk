import { FC } from 'react'
import { FaBottleWater, FaFishFins, FaSeedling, FaShrimp } from 'react-icons/fa6'
import { GiGrapes, GiWheat } from 'react-icons/gi'
import { LuEgg, LuMilk, LuSprout } from 'react-icons/lu'
import { PiCookingPotFill, PiNutFill, PiPlantFill } from 'react-icons/pi'

import { Allergen } from '@/entities/recipe/model/recipe'
import { cn } from '@/shared/lib/utils'

const allergenIcons: Record<Allergen, FC> = {
    gluten: GiWheat,
    crustaceans: FaShrimp,
    eggs: LuEgg,
    fish: FaFishFins,
    peanuts: PiNutFill,
    soy: FaBottleWater,
    dairy: LuMilk,
    nuts: PiNutFill,
    celery: PiPlantFill,
    mustard: PiCookingPotFill,
    sesame: FaSeedling,
    sulphites: GiGrapes,
    lupin: LuSprout,
    molluscs: FaShrimp,
}

const allergenNames: Record<Allergen, string> = {
    gluten: 'Gluten',
    crustaceans: 'Crustáceos',
    eggs: 'Huevos',
    fish: 'Pescado',
    peanuts: 'Cacahuetes',
    soy: 'Soja',
    dairy: 'Lácteos',
    nuts: 'Frutos secos',
    celery: 'Apio',
    mustard: 'Mostaza',
    sesame: 'Sésamo',
    sulphites: 'Sulfitos',
    lupin: 'Altramuces',
    molluscs: 'Moluscos',
}

interface AllergenIconProps {
    allergen: Allergen
    className?: string
}

export const AllergenIcon: FC<AllergenIconProps> = ({ allergen, className }) => {
    const Icon = allergenIcons[allergen]
    return (
        <div className={cn('group relative flex h-8 w-8 items-center justify-center rounded-full', className)}>
            <Icon className='h-5 w-5 text-primary/80 transition-colors hover:text-primary' />
            <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100'>
                {allergenNames[allergen]}
            </div>
        </div>
    )
}
