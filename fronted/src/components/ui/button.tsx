import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out w-full sm:w-auto",
          variant === "default"
            ? "bg-white text-black hover:bg-gray-200 active:scale-[0.98]"
            : "border border-gray-700 text-white hover:bg-gray-800 hover:text-gray-100 active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

