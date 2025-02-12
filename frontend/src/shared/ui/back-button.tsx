import { FC } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  className?: string
}

export const BackButton: FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="p-2 hover:bg-white/10 rounded-full transition-colors"
    >
      <ArrowLeft className="w-6 h-6 text-white" />
    </button>
  )
} 