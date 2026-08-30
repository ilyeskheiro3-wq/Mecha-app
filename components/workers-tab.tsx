"use client"

import { useMemo, useState } from "react"
import { Plus, Users, Trash2, CalendarDays, Coins, Tag, Edit } from "lucide-react"
import { EmptyState, Sheet, TextField, NumberField } from "@/components/primitives"
import { Button } from "@/components/ui/button"
import { type WorkerService, type WorkerLog, formatDA } from "@/lib/types"

const num = (v: string) => {
  const n = Number.parseFloat(v.replace(",", "."))
  return Number.isNaN(n) ? 0 : n
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function WorkersTab({
  services,
  logs,
  onAddLogs,
  onDeleteLog,
  onAddService,
  onEditService,
  onEditLog,
}: {
  services: WorkerService[]
  logs: WorkerLog[]
  onAddLogs: (entries: WorkerLog[]) => void
  onDeleteLog: (id: string) => void
  onAddService?: (name: string, price: number) => void // Optional for creating services
  onEditService?: (id: string, name: string, price: number) => void // Optional for editing services
  onEditLog?: (id: string, updates: Partial<WorkerLog>) => void // Optional for editing logs
}) {
  const [date, setDate] = useState(todayISO())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [worker, setWorker] = useState("")
  const [note, setNote] = useState("")
  const [picked, setPicked] = useState<string[]>([]) // service ids (multiple allowed, repeats ok)
  
  // New service creation
  const [showNewService, setShowNewService] = useState(false)
  const [newServiceName, setNewServiceName] = useState("")
  const [newServicePrice, setNewServicePrice] = useState("")
  
  // Service editing
  const [editingService, setEditingService] = useState<WorkerService | null>(null)
  const [editServiceName, setEditServiceName] = useState("")
  const [editServicePrice, setEditServicePrice] = useState("")
  
  // Job editing
  const [editingLog, setEditingLog] = useState<WorkerLog | null>(null)
  const [editLogWorker, setEditLogWorker] = useState("")
  const [editLogService, setEditLogService] = useState("")
  const [editLogPrice, setEditLogPrice] = useState("")
  const [editLogNote, setEditLogNote] = useState("")
  const [showEditLogModal, setShowEditLogModal] = useState(false)

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
    setShowNewService(false)
    setNewServiceName("")
    setNewServicePrice("")
    setEditingService(null)
    setEditServiceName("")
    setEditServicePrice("")
  }

  const createNewService = () => {
    if (!newServiceName.trim() || !newServicePrice.trim() || !onAddService) return
    onAddService(newServiceName.trim(), num(newServicePrice))
    setNewServiceName("")
    setNewServicePrice("")
    setShowNewService(false)
  }

  const startEditService = (service: WorkerService) => {
    setEditingService(service)
    setEditServiceName(service.name)
    setEditServicePrice(service.price.toString())
  }

  const saveEditService = () => {
    if (!editingService || !editServiceName.trim() || !editServicePrice.trim() || !onEditService) return
    onEditService(editingService.id, editServiceName.trim(), num(editServicePrice))
    setEditingService(null)
    setEditServiceName("")
    setEditServicePrice("")
  }

  const startEditLog = (log: WorkerLog) => {
    setEditingLog(log)
    setEditLogWorker(log.worker)
    setEditLogService(log.serviceName)
    setEditLogPrice(log.price.toString())
    setEditLogNote(log.note)
    setShowEditLogModal(true)
  }

  const saveEditLog = () => {
    if (!editingLog || !editLogWorker.trim() || !editLogService.trim() || !editLogPrice.trim() || !onEditLog) return
    onEditLog(editingLog.id, {
      worker: editLogWorker.trim(),
      serviceName: editLogService.trim(),
      price: num(editLogPrice),
      note: editLogNote.trim(),
    })
    setShowEditLogModal(false)
    setEditingLog(null)
    setEditLogWorker("")
    setEditLogService("")
    setEditLogPrice("")
    setEditLogNote("")
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

      <button
        onClick={() => {
          resetSheet()
          setSheetOpen(true)
        }}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
      >
        <Plus className="size-5" />
        <span className="font-semibold">Add job</span>
      </button>

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
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{l.serviceName}</p>
                        {l.note && <p className="truncate text-xs text-muted-foreground italic">{l.note}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {formatDA(l.price)}
                        </span>
                        {onEditLog && (
                          <button
                            onClick={() => startEditLog(l)}
                            className="text-primary"
                            aria-label="Edit job"
                            title="Edit this job"
                          >
                            <Edit className="size-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setWorker(name)
                            setDate(l.date)
                            setNote(l.note || "")
                            setSheetOpen(true)
                          }}
                          className="text-primary"
                          aria-label="Add more services"
                          title="Add more services for this worker"
                        >
                          <Plus className="size-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLog(l.id)}
                          className="text-muted-foreground"
                          aria-label="Delete job"
                          title="Delete this job"
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
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Tap the services done (tap again to add more)
              </span>
              {onAddService && (
                <button
                  onClick={() => setShowNewService(!showNewService)}
                  className="text-xs font-semibold text-primary"
                >
                  {showNewService ? "Cancel" : "+ New service"}
                </button>
              )}
            </div>
            
            {showNewService && onAddService && (
              <div className="mb-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="size-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Create new service</span>
                </div>
                <div className="flex flex-col gap-2">
                  <TextField 
                    label="Service name" 
                    value={newServiceName} 
                    onChange={setNewServiceName} 
                    placeholder="Vidange boîte" 
                  />
                  <div className="flex gap-2">
                    <NumberField 
                      label="Price" 
                      value={newServicePrice} 
                      onChange={setNewServicePrice} 
                      placeholder="1000" 
                      suffix="DA"
                    />
                    <Button
                      onClick={createNewService}
                      disabled={!newServiceName.trim() || !newServicePrice.trim()}
                      className="h-12 rounded-xl px-4"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {services.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                {onAddService 
                  ? "No services yet. Create one above or add them in the Settings tab." 
                  : "No services yet. Add them in the Settings tab first."
                }
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {services.map((s) => {
                  const count = countFor(s.id)
                  const isEditing = editingService?.id === s.id
                  
                  if (isEditing) {
                    return (
                      <div key={s.id} className="col-span-2 rounded-xl border-2 border-primary bg-primary/5 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="size-4 text-primary" />
                          <span className="text-sm font-semibold text-primary">Edit service</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <TextField 
                            label="Service name" 
                            value={editServiceName} 
                            onChange={setEditServiceName} 
                            placeholder="Vidange boîte" 
                          />
                          <div className="flex gap-2">
                            <NumberField 
                              label="Price" 
                              value={editServicePrice} 
                              onChange={setEditServicePrice} 
                              placeholder="1000" 
                              suffix="DA"
                            />
                            <Button
                              onClick={saveEditService}
                              disabled={!editServiceName.trim() || !editServicePrice.trim()}
                              className="h-12 rounded-xl px-4"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingService(null)
                                setEditServiceName("")
                                setEditServicePrice("")
                              }}
                              className="h-12 rounded-xl px-4 bg-secondary text-secondary-foreground"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  
                  return (
                    <button
                      key={s.id}
                      onClick={() => togglePick(s.id)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        if (onEditService) {
                          startEditService(s)
                        }
                      }}
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
                      {onEditService && (
                        <span className="text-[9px] text-muted-foreground">Hold to edit</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Sheet>

      {/* Edit Job Modal */}
      {showEditLogModal && editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-foreground">Edit Job</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Worker name
                </label>
                <input
                  type="text"
                  value={editLogWorker}
                  onChange={(e) => setEditLogWorker(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
                  placeholder="Karim"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Service name
                </label>
                <input
                  type="text"
                  value={editLogService}
                  onChange={(e) => setEditLogService(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
                  placeholder="Vidange moteur"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Price (DA)
                </label>
                <input
                  type="number"
                  value={editLogPrice}
                  onChange={(e) => setEditLogPrice(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={editLogNote}
                  onChange={(e) => setEditLogNote(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
                  placeholder="Golf 7 - client Ali"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowEditLogModal(false)
                  setEditingLog(null)
                  setEditLogWorker("")
                  setEditLogService("")
                  setEditLogPrice("")
                  setEditLogNote("")
                }}
                className="flex-1 rounded-lg border border-border bg-secondary px-4 py-3 font-semibold text-secondary-foreground"
              >
                Cancel
              </button>
              <button
                onClick={saveEditLog}
                disabled={!editLogWorker.trim() || !editLogService.trim() || !editLogPrice.trim()}
                className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
