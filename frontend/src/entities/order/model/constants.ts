import { SupplierCategory } from './types'

export const CATEGORY_STYLES: Record<SupplierCategory, { bg: string, text: string }> = {
  pescado: { bg: 'bg-blue-500/15', text: 'text-white' },
  carne: { bg: 'bg-red-500/15', text: 'text-white' },
  frutaVerdura: { bg: 'bg-green-500/15', text: 'text-white' },
  seco: { bg: 'bg-amber-500/15', text: 'text-white' },
  congelado: { bg: 'bg-slate-300/15', text: 'text-white' },
  limpieza: { bg: 'bg-pink-500/15', text: 'text-white' }
} as const

export const DRAG_THRESHOLDS = {
  actionTrigger: 100,
  scaleStart: 50,
  opacityStart: 75
} as const 