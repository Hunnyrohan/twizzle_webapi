import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = {
    default: "bg-black text-white hover:bg-black/90",
    destructive: "bg-red-500 text-white hover:bg-red-500/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    twitter: "bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] font-bold rounded-full",
    twitter_outline: "border border-[#cfd9de] text-[#1d9bf0] hover:bg-[#1d9bf0]/10 font-bold rounded-full",
    twitter_black: "bg-[#0f1419] text-white hover:bg-[#272c30] font-bold rounded-full", // For "Next" buttons etc
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof buttonVariants
    size?: "default" | "sm" | "lg" | "icon" | "full"
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {


        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    buttonVariants[variant],
                    size === "default" && "h-10 px-4 py-2",
                    size === "sm" && "h-9 rounded-md px-3",
                    size === "lg" && "h-11 rounded-md px-8",
                    size === "icon" && "h-10 w-10",
                    size === "full" && "w-full h-12 text-[17px]",
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
