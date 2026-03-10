import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-green-600 text-white shadow hover:bg-green-600/80",
        secondary:
          "border-transparent bg-zinc-700 text-zinc-100 hover:bg-zinc-600",
        destructive:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-600/80",
        outline:
          "border-zinc-700 text-zinc-100",
        success:
          "border-transparent bg-emerald-600 text-white shadow hover:bg-emerald-600/80",
        warning:
          "border-transparent bg-amber-600 text-white shadow hover:bg-amber-600/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
