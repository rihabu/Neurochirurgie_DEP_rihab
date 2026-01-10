"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  value: string | number
  onChange: (value: string) => void
  type?: "text" | "number" | "date" | "datetime-local" | "email" | "tel" | "textarea" | "select"
  options?: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  hint?: string
  error?: string
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  placeholder,
  required,
  disabled,
  className,
  hint,
  error,
}: FormFieldProps) {
  const id = `field-${name}`

  const validOptions = options?.filter((option) => option.value !== "") || []

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-critical")}>
        {label}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(error && "border-critical")}
        />
      ) : type === "select" && validOptions.length > 0 ? (
        <Select value={String(value) || undefined} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger id={id} className={cn(error && "border-critical")}>
            <SelectValue placeholder={placeholder || "Sélectionner..."} />
          </SelectTrigger>
          <SelectContent>
            {validOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(error && "border-critical")}
        />
      )}

      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-critical">{error}</p>}
    </div>
  )
}
