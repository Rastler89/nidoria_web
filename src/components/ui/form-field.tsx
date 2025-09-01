"use client"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  className?: string
}

export function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("transition-all duration-200", error && "border-destructive focus-visible:border-destructive")}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">{error}</p>}
    </div>
  )
}
