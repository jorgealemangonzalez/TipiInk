import * as React from 'react'

import { cn } from '@/shared/lib/utils'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

const TooltipProvider = TooltipPrimitive.Provider

// Create a custom Tooltip wrapper that handles both hover and click/touch
const Tooltip = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
        // Add any additional props if needed
    }
>(({ children, ...props }) => {
    const [open, setOpen] = React.useState(false)

    // If open is controlled externally, use that instead
    const isControlled = props.open !== undefined
    const isOpen = isControlled ? props.open : open

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setOpen(newOpen)
        }
        props.onOpenChange?.(newOpen)
    }

    // Clone children to inject necessary handlers for click/touch events
    const enhancedChildren = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TooltipTrigger) {
            return React.cloneElement(child as React.ReactElement, {
                onClick: (e: React.MouseEvent) => {
                    // Prevent event bubbling which might interfere with tooltip opening
                    e.stopPropagation()

                    // Combine with any existing onClick
                    if (child.props.onClick) {
                        child.props.onClick(e)
                    }

                    // Force toggle tooltip on click - ensure it's actually toggling the state
                    handleOpenChange(!isOpen)
                },
            })
        }
        return child
    })

    return (
        <TooltipPrimitive.Root
            {...props}
            open={isOpen}
            onOpenChange={handleOpenChange}
            delayDuration={0} // Reduce delay for click interactions
        >
            {enhancedChildren}
        </TooltipPrimitive.Root>
    )
})
Tooltip.displayName = TooltipPrimitive.Root.displayName

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-[--radix-tooltip-content-transform-origin] overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground',
                className,
            )}
            {...props}
        />
    </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
