import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Phone, Building2, Truck, Plus, X } from "lucide-react"
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"

interface FloatingContactButtonsProps {
  commercialPhone: string
  deliveryPhone: string
  centralStationPhone?: string
}

export function FloatingContactButtons({ commercialPhone, deliveryPhone, centralStationPhone = "123456789" }: FloatingContactButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const buttonVariants = {
    closed: { scale: 0, opacity: 0 },
    open: { scale: 1, opacity: 1 }
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Delivery Phone */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={buttonVariants}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-24 right-0"
            >
              <Button
                size="icon"
                className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
                onClick={() => handleCall(deliveryPhone)}
              >
                <Truck className="w-6 h-6" />
              </Button>
            </motion.div>

            {/* Commercial Phone */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={buttonVariants}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
              className="absolute bottom-16 right-16"
            >
              <Button
                size="icon"
                className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                onClick={() => handleCall(commercialPhone)}
              >
                <Phone className="w-6 h-6" />
              </Button>
            </motion.div>

            {/* Central Station */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={buttonVariants}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
              className="absolute bottom-0 right-24"
            >
              <Button
                size="icon"
                className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
                onClick={() => handleCall(centralStationPhone)}
              >
                <Building2 className="w-6 h-6" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <Button
        size="icon"
        variant="default"
        className="size-14 rounded-full text-black shadow-lg opacity-60"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <ChatBubbleLeftRightIcon className="w-6 h-6" />}
      </Button>
    </div>
  )
}