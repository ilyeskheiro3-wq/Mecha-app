"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Sheet, TextField, NumberField } from "@/components/primitives"
import { Button } from "@/components/ui/button"
import {
  type Appointment,
  type Parts,
  type ServiceKind,
  SERVICE_LABEL,
  oilCost,
  partsTotal,
  formatDA,
} from "@/lib/types"

const num = (v: string) => {
  const n = Number.parseFloat(v.replace(",", "."))
  return Number.isNaN(n) ? 0 : n
}

const FILTER_ROWS: { key: keyof Parts; label: string }[] = [
  { key: "filtreHuile", label: "Filtre à huile" },
  { key: "filtreAir", label: "Filtre à air" },
  { key: "filtreGasoil", label: "Filtre gasoil" },
  { key: "filtreClima", label: "Filtre clima" },
  { key: "plaquettes", label: "Plaquettes" },
]

export function VehicleSheet({
  open,
  appointment,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean
  appointment: Appointment | null
  onClose: () => void
  onSave: (a: Appointment) => void
  onDelete: (id: string) => void
}) {
  const [draft, setDraft] = useState<Appointment | null>(appointment)

  useEffect(() => {
    setDraft(appointment)
  }, [appointment])

  if (!draft) return null

  const update = (patch: Partial<Appointment>) => setDraft({ ...draft, ...patch })
  const updateParts = (patch: Partial<Parts>) => setDraft({ ...draft, parts: { ...draft.parts, ...patch } })

  const toggleService = (s: ServiceKind) => {
    const has = draft.services.includes(s)
    update({ services: has ? draft.services.filter((x) => x !== s) : [...draft.services, s] })
  }

  const total = partsTotal(draft.parts)

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={draft.vehicle || draft.plate || draft.phone || "New vehicle"}
      footer={
        <div className="flex items-center gap-3">
          <button
            onClick={() => onDelete(draft.id)}
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
            aria-label="Delete"
          >
            <Trash2 className="size-5" />
          </button>
          <Button
            className="h-12 flex-1 rounded-xl text-base font-semibold"
            onClick={() => onSave(draft)}
          >
            Save vehicle
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Vehicle (optional)"
            value={draft.vehicle}
            onChange={(v) => update({ vehicle: v })}
            placeholder="Golf 7"
          />
          <TextField
            label="Plate (optional)"
            value={draft.plate}
            onChange={(v) => update({ plate: v })}
            placeholder="00123-114-16"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Phone (optional)"
            type="tel"
            inputMode="numeric"
            value={draft.phone}
            onChange={(v) => update({ phone: v })}
            placeholder="0555 00 00 00"
          />
          <TextField
            label="Rendez-vous time"
            type="time"
            value={draft.time}
            onChange={(v) => update({ time: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="KM crossed (optional)"
            value={draft.km || ""}
            onChange={(v) => update({ km: num(v) })}
            placeholder="0"
            suffix="km"
          />
          <TextField
            label="Oil type (optional)"
            value={draft.oilType}
            onChange={(v) => update({ oilType: v })}
            placeholder="5W-40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Service type</span>
          <div className="grid grid-cols-2 gap-3">
            {(["moteur", "boite"] as ServiceKind[]).map((s) => {
              const active = draft.services.includes(s)
              return (
                <button
                  key={s}
                  onClick={() => toggleService(s)}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <span className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                    {SERVICE_LABEL[s]}
                  </span>
                  <span className="text-xs text-muted-foreground">{s === "moteur" ? "30 min" : "2 hours"}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-bold text-foreground">Oil</p>
          
          {/* Oil pricing mode toggle */}
          <div className="mb-3 flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Pricing mode</span>
            <div className="flex gap-2">
              <button
                onClick={() => updateParts({ oilPricingMode: "per5L" })}
                className={`flex-1 rounded-lg border-2 py-2 text-xs font-semibold transition-colors ${
                  draft.parts.oilPricingMode === "per5L"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                Per 5L
              </button>
              <button
                onClick={() => updateParts({ oilPricingMode: "per1L" })}
                className={`flex-1 rounded-lg border-2 py-2 text-xs font-semibold transition-colors ${
                  draft.parts.oilPricingMode === "per1L"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                Per 1L
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label={draft.parts.oilPricingMode === "per5L" ? "Price of 5 L" : "Price per 1 L"}
              value={draft.parts.oilPricePer5L || ""}
              onChange={(v) => updateParts({ oilPricePer5L: num(v) })}
              placeholder="0"
              suffix="DA"
            />
            <NumberField
              label="Liters used"
              value={draft.parts.oilLitersUsed || ""}
              onChange={(v) => updateParts({ oilLitersUsed: num(v) })}
              placeholder="0"
              suffix="L"
            />
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
            <span className="text-xs text-muted-foreground">
              {draft.parts.oilPricingMode === "per5L" 
                ? "Oil cost (price / 5 × liters)" 
                : "Oil cost (price × liters)"}
            </span>
            <span className="text-sm font-semibold text-foreground">{formatDA(oilCost(draft.parts))}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-bold text-foreground">Filters &amp; parts</p>
          <div className="flex flex-col gap-3">
            {FILTER_ROWS.map((row) => (
              <NumberField
                key={row.key}
                label={row.label}
                value={(draft.parts[row.key] as number) || ""}
                onChange={(v) => updateParts({ [row.key]: num(v) } as Partial<Parts>)}
                placeholder="0"
                suffix="DA"
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-bold text-foreground">Main d'oeuvre</p>
          <NumberField
            label="Price (type manually)"
            value={draft.parts.mainDoeuvre || ""}
            onChange={(v) => updateParts({ mainDoeuvre: num(v) })}
            placeholder="0"
            suffix="DA"
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-accent px-4 py-4 text-accent-foreground">
          <span className="text-sm font-medium">Total parts for this car</span>
          <span className="text-2xl font-extrabold tabular-nums">{formatDA(total)}</span>
        </div>
      </div>
    </Sheet>
  )
}
