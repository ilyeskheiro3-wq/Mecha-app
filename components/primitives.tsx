"use client"

import type React from "react"
import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  suffix,
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  inputMode?: "text" | "numeric" | "decimal"
  suffix?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative flex items-center">
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-12 w-full rounded-xl border border-border bg-card px-3.5 text-base text-foreground outline-none",
            "transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
            suffix && "pr-12",
          )}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3.5 text-sm font-medium text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  )
}

export function NumberField(props: Omit<Parameters<typeof TextField>[0], "type" | "inputMode">) {
  return <TextField {...props} type="text" inputMode="decimal" />
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] animate-in fade-in"
      />
      <div className="relative flex max-h-[92vh] flex-col rounded-t-3xl bg-background shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-foreground text-balance">{title}</h2>
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-border bg-card px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode
  title: string
  hint: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">{icon}</div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="max-w-[240px] text-pretty text-sm text-muted-foreground">{hint}</p>
    </div>
  )
}
