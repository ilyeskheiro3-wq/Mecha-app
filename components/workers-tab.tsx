"use client"

import { useMemo, useState } from "react"
import { Plus, Users, Trash2, CalendarDays, Coins } from "lucide-react"
import { EmptyState, Sheet, TextField } from "@/components/primitives"
import { Button } from "@/components/ui/button"
import { type WorkerService, type WorkerLog, formatDA } from "@/lib/types"

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function WorkersTab({
  services,
  logs,
  onAddLogs,
  onDeleteLog,
}: {
  services: WorkerService[]
  logs: WorkerLog[]
  onAddLogs: (entries: WorkerLog[]) => void
  onDeleteLog: (id: string) => void
}) {
  const [date, setDate] = useState(todayISO())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [worker, setWorker] = useState("")
  const [note, setNote] = useState("")
  const [picked, setPicked] = useState<string[]>([]) // service ids (multiple allowed, repeats ok)

  const dayLogs = useMemo(() => logs.filter((l) => l.date === date), [logs, date])

  const byWorker = useMemo(() => {
    const map = new Map<string, WorkerLog[]>()
    for (const l of dayLogs) {
      const arr = map.get(l.worker) ?? []
      arr.push(l)
      map.set(l.worker, arr)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [dayLogs])

  const dayTotal = dayLogs.reduce((s, l) => s + l.price, 0)

  const pickedTotal = picked.reduce((sum, id) => {
    const svc = services.find((s) => s.id === id)
    return sum + (svc?.price ?? 0)
  }, 0)

  const resetSheet = () => {
    setWorker("")
    setNote("")
    setPicked([])
  }

  const save = () => {
    if (!worker.trim() || picked.length === 0) return
    const entries: WorkerLog[] = picked.map((id, i) => {
      const svc = services.find((s) => s.id === id)!
      return {
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        worker: worker.trim(),
        date,
        serviceId: svc.id,
        serviceName: svc.name,
        price: svc.price,
        note: note.trim(),
      }
    })
    onAddLogs(entries)
    resetSheet()
    setSheetOpen(false)
  }

  const togglePick = (id: string) => {
    setPicked((prev) => {
      const idx = prev.indexOf(id)
      if (idx === -1) return [...prev, id]
      const copy = [...prev]
      copy.splice(idx, 1)
      return copy
    })
  }

  const countFor = (id: string) => picked.filter((p) => p === id).length

  return (
    <div className="flex flex-col gap-4 pb-28">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Workers</h1>
          <p className="text-sm text-muted-foreground">Track the jobs done each day</p>
        </div>
      </header>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
        <CalendarDays className="size-5 text-primary" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 bg-transparent text-base font-semibold text-foreground outline-none"
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-accent px-4 py-4 text-accent-foreground">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Coins className="size-4" />
          Day total
        </span>
        <span className="text-2xl font-extrabold tabular-nums">{formatDA(dayTotal)}</span>
      </div>

      {byWorker.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" />}
          title="No jobs logged"
          hint="Tap Add job, pick the worker and the services they did. The daily total adds up automatically."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {byWorker.map(([name, items]) => {
            const wTotal = items.reduce((s, l) => s + l.price, 0)
            return (
              <div key={name} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2.5">
                  <span className="font-bold text-foreground">{name}</span>
                  <span className="text-sm font-bold text-primary">{formatDA(wTotal)}</span>
                </div>
                <ul>
                  {items.map((l) => (
                    <li key={l.id} className="flex items-center justify-between px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{l.serviceName}</p>
                        {l.note ? <p className="truncate text-xs text-muted-foreground">{l.note}</p> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {formatDA(l.price)}
                        </span>
                        <button
                          onClick={() => {
                            setWorker(name)
                            setDate(l.date)
                            setSheetOpen(true)
                          }}
                          className="text-primary"
                          aria-label="Add more services"
                        >
                          <Plus className="size-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLog(l.id)}
                          className="text-muted-foreground"
                          aria-label="Delete job"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 mx-auto flex max-w-md justify-end px-5">
        <button
          onClick={() => {
            resetSheet()
            setSheetOpen(true)
          }}
          className="pointer-events-auto flex h-14 items-center gap-2 rounded-full bg-primary pl-5 pr-6 text-primary-foreground shadow-lg shadow-primary/30 active:scale-95"
        >
          <Plus className="size-5" />
          <span className="font-semibold">Add job</span>
        </button>
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Log a worker's jobs"
        footer={
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm">
              <p className="text-muted-foreground">Selected</p>
              <p className="text-lg font-extrabold text-foreground">{formatDA(pickedTotal)}</p>
            </div>
            <Button
              onClick={save}
              disabled={!worker.trim() || picked.length === 0}
              className="h-12 flex-1 rounded-xl text-base font-semibold"
            >
              Save jobs
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <TextField label="Worker name" value={worker} onChange={setWorker} placeholder="Karim" />
          <TextField label="Note (optional)" value={note} onChange={setNote} placeholder="Golf 7 - client Ali" />

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Tap the services done (tap again to add more)
            </span>
            {services.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                No services yet. Add them in the Settings tab first.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {services.map((s) => {
                  const count = countFor(s.id)
                  return (
                    <button
                      key={s.id}
                      onClick={() => togglePick(s.id)}
                      className={`relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
                        count > 0 ? "border-primary bg-primary/10" : "border-border bg-card"
                      }`}
                    >
                      {count > 0 ? (
                        <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                          {count}
                        </span>
                      ) : null}
                      <span className="pr-6 text-sm font-semibold text-foreground">{s.name}</span>
                      <span className="text-xs font-medium text-primary">{formatDA(s.price)}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Sheet>
    </div>
  )
}
