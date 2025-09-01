import { AntIcon } from "./ant-icon"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div className={cn("animate-spin", sizeClasses[size])}>
        <AntIcon className="text-primary" size={size === "sm" ? 16 : size === "md" ? 24 : 32} />
      </div>
      {text && <span className="text-sm text-muted-foreground animate-pulse">{text}</span>}
    </div>
  )
}
