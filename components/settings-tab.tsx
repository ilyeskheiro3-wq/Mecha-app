"use client"

import { useState } from "react"
import { Plus, Trash2, Wrench, Tag } from "lucide-react"
import { EmptyState, TextField, NumberField } from "@/components/primitives"
import { Button } from "@/components/ui/button"
import { type WorkerService, formatDA } from "@/lib/types"

const num = (v: string) => {
  const n = Number.parseFloat(v.replace(",", "."))
  return Number.isNaN(n) ? 0 : n
}

export function SettingsTab({
  services,
  onAdd,
  onDelete,
}: {
  services: WorkerService[]
  onAdd: (name: string, price: number) => void
  onDelete: (id: string) => void
}) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  const submit = () => {
    if (!name.trim()) return
    onAdd(name.trim(), num(price))
    setName("")
    setPrice("")
  }

  return (
    <div className="flex flex-col gap-5 pb-28">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Define the services and their fixed prices</p>
      </header>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <Tag className="size-4 text-primary" />
          New service
        </p>
        <div className="flex flex-col gap-3">
          <TextField label="Service name" value={name} onChange={setName} placeholder="Vidange boîte" />
          <NumberField label="Price" value={price} onChange={setPrice} placeholder="1000" suffix="DA" />
          <Button onClick={submit} disabled={!name.trim()} className="h-12 rounded-xl text-base font-semibold">
            <Plus className="size-5" />
            Add service
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Services ({services.length})
        </p>
        {services.length === 0 ? (
          <EmptyState
            icon={<Wrench className="size-6" />}
            title="No services yet"
            hint="Add services like Vidange boîte, Vidange moteur, or Diagnostic with their price. You'll tap them in the Workers tab."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5"
              >
                <div>
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="text-sm font-medium text-primary">{formatDA(s.price)}</p>
                </div>
                <button
                  onClick={() => onDelete(s.id)}
                  className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
                  aria-label={`Delete ${s.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
