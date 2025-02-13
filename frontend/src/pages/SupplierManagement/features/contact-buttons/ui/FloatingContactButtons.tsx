import { Button } from "@/components/ui/button"
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "framer-motion"
import { Building2, Phone, Truck, X } from "lucide-react"
import { useState } from "react"

interface FloatingContactButtonsProps {
  commercialPhone: string
  deliveryPhone: string
  centralStationPhone?: string
}

export function FloatingContactButtons({ commercialPhone, deliveryPhone, centralStationPhone = "123456789" }: FloatingContactButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const buttonVariants = {
    closed: { scale: 0, opacity: 0, y: -20 },
    open: { scale: 1, opacity: 1, y: 0 }
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_blank')
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 flex flex-col gap-2">
            {/* Delivery Phone */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={buttonVariants}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Button
                size="icon"
                className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
                onClick={() => handleCall(deliveryPhone)}
              >
                <Truck className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Commercial Phone */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={buttonVariants}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
            >
              <Button
                size="icon"
                className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                onClick={() => handleCall(commercialPhone)}
              >
                <Phone className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Central Station */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={buttonVariants}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
            >
              <Button
                size="icon"
                className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
                onClick={() => handleCall(centralStationPhone)}
              >
                <Building2 className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <Button
        size="icon"
        variant="outline"
        className="w-10 h-10 rounded-full hover:bg-gray-700/30"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <ChatBubbleLeftRightIcon className="w-5 h-5" />}
      </Button>
    </div>
  )
}