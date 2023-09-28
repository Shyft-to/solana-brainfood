import React, { HTMLAttributes } from "react"
import { tv, VariantProps } from "tailwind-variants"
import { cn } from "@/utils/cn"
import { forwardRefWithAs } from "@/utils/render"

const typographyVariants = tv({
  base: "leading-snug",
  variants: {
    level: {
      h1: "text-7xl font-semibold",
      h2: "text-6xl font-semibold",
      h3: "text-5xl font-medium",
      h4: "text-4xl font-medium",
      h5: "text-3xl font-medium",
      h6: "text-2xl	font-medium",
      body1: "text-xl",
      body2: "text-lg",
      body3: "text-base",
      body4: "text-sm",
      body5: "text-xs",
    },
    color: {
      primary: "text-primary-500",
      info: "text-info-500",
      warning: "text-warning-500",
      success: "text-success-500",
      error: "text-error-500",
      secondary: "text-gray-600",
    },
  },
  defaultVariants: {
    level: "body3",
  },
})

const defaultVariantMapping: Record<NonNullable<VariantProps<typeof typographyVariants>["level"]>, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  body3: "span",
  body4: "span",
  body5: "span",
}

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof typographyVariants> {}

export const Typography = forwardRefWithAs<
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "b" | "em" | "div",
  TypographyProps
>((props, ref) => {
  const { level = "body3", color, children, as, className, ...rest } = props

  const Tag = as ?? defaultVariantMapping[level ?? "body3"]

  return (
    <Tag ref={ref} className={cn(typographyVariants({ level, color, className }))} {...rest}>
      {children}
    </Tag>
  )
})
