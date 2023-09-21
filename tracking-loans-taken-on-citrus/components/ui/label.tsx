import * as LabelPrimitive from "@radix-ui/react-label"
import * as React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/utils/cn"

const labelVariants = tv({
  base: '"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"',
})

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
