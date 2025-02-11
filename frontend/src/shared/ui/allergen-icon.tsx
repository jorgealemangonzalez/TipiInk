import { FC } from 'react'
import { GiWheat, GiGrapes } from 'react-icons/gi'
import { 
  FaFishFins,
  FaShrimp,
  FaBottleWater,
  FaSeedling
} from 'react-icons/fa6'
import {
  LuEgg,
  LuMilk,
  LuSprout
} from 'react-icons/lu'
import { 
  PiPlantFill,
  PiNutFill,
  PiCookingPotFill
} from 'react-icons/pi'
import { Allergen } from '@/entities/recipe/model/types'
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
  molluscs: FaShrimp
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
  molluscs: 'Moluscos'
}

interface AllergenIconProps {
  allergen: Allergen
  className?: string
}

export const AllergenIcon: FC<AllergenIconProps> = ({ allergen, className }) => {
  const Icon = allergenIcons[allergen]
  return (
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center group relative",
      className
    )}>
      <Icon className="w-5 h-5 text-primary/80 hover:text-primary transition-colors" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-xs text-primary px-2 py-1 rounded whitespace-nowrap">
        {allergenNames[allergen]}
      </div>
    </div>
  )
} 