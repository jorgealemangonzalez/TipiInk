import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDeliveryDate = (date: Date): string => {
    const formatted = format(date, 'EEE d - HH:mm', { locale: es }).replace(
        /lun|mar|mié|jue|vie|sáb|dom/g,
        match => `${match}.`,
    )
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
