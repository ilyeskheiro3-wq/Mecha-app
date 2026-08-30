"use client"

import { useEffect, useState } from "react"
import { CalendarClock, Users, Settings } from "lucide-react"
import { ScheduleTab } from "@/components/schedule-tab"
import { WorkersTab } from "@/components/workers-tab"
import { SettingsTab } from "@/components/settings-tab"
import { VehicleSheet } from "@/components/vehicle-sheet"
import { type Appointment, type ApptStatus, type WorkerService, type WorkerLog, EMPTY_PARTS } from "@/lib/types"

type Tab = "schedule" | "workers" | "settings"

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// Normalize appointments loaded from older versions of the app
function normalizeAppointment(a: Partial<Appointment>): Appointment {
  const legacyDone = (a as { done?: boolean }).done
  return {
    id: a.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    vehicle: a.vehicle ?? "",
    plate: a.plate ?? "",
    phone: a.phone ?? "",
    km: a.km ?? 0,
    oilType: a.oilType ?? "",
    services: a.services ?? [],
    time: a.time ?? "08:00",
    date: a.date ?? todayISO(),
    order: a.order ?? 0,
    status: a.status ?? (legacyDone ? "finished" : "waiting"),
    parts: a.parts ?? { ...EMPTY_PARTS },
  }
}

const KEYS = {
  appts: "vidange.appointments.v1",
  services: "vidange.services.v1",
  logs: "vidange.logs.v1",
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export default function Page() {
  const [tab, setTab] = useState<Tab>("schedule")
  const [ready, setReady] = useState(false)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<WorkerService[]>([])
  const [logs, setLogs] = useState<WorkerLog[]>([])
  const [scheduleDate, setScheduleDate] = useState<string>(todayISO())

  const [editing, setEditing] = useState<Appointment | null>(null)

  // hydrate from localStorage once
  useEffect(() => {
    setAppointments(load<Partial<Appointment>[]>(KEYS.appts, []).map(normalizeAppointment))
    setServices(load<WorkerService[]>(KEYS.services, []))
    setLogs(load<WorkerLog[]>(KEYS.logs, []))
    setReady(true)
  }, [])

  // persist
  useEffect(() => {
    if (ready) window.localStorage.setItem(KEYS.appts, JSON.stringify(appointments))
  }, [appointments, ready])
  useEffect(() => {
    if (ready) window.localStorage.setItem(KEYS.services, JSON.stringify(services))
  }, [services, ready])
  useEffect(() => {
    if (ready) window.localStorage.setItem(KEYS.logs, JSON.stringify(logs))
  }, [logs, ready])

  // ---- appointment actions ----
  const addAppointment = () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    const maxOrder = appointments
      .filter((a) => a.date === scheduleDate)
      .reduce((m, a) => Math.max(m, a.order), 0)
    setEditing({
      id: uid(),
      vehicle: "",
      plate: "",
      phone: "",
      km: 0,
      oilType: "",
      services: ["moteur"],
      time,
      date: scheduleDate,
      order: maxOrder + 1,
      status: "waiting",
      parts: { ...EMPTY_PARTS },
    })
  }

  const saveAppointment = (a: Appointment) => {
    setAppointments((prev) => {
      const exists = prev.some((x) => x.id === a.id)
      return exists ? prev.map((x) => (x.id === a.id ? a : x)) : [...prev, a]
    })
    setEditing(null)
  }

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((x) => x.id !== id))
    setEditing(null)
  }

  const setApptStatus = (
    id: string, 
    status: ApptStatus, 
    arrivalTime?: string, 
    estimatedDuration?: number, 
    garage?: 1 | 2
  ) =>
    setAppointments((prev) => 
      prev.map((x) => 
        x.id === id 
          ? { 
              ...x, 
              status, 
              ...(arrivalTime && { arrivalTime }),
              ...(estimatedDuration && { estimatedDuration }),
              ...(garage && { garage })
            } 
          : x
      )
    )

  const reorder = (id: string, dir: -1 | 1) => {
    setAppointments((prev) => {
      const target = prev.find((x) => x.id === id)
      if (!target) return prev
      // only reorder within the same day
      const sameDay = prev.filter((x) => x.date === target.date).sort((a, b) => a.order - b.order)
      const idx = sameDay.findIndex((x) => x.id === id)
      const swap = idx + dir
      if (swap < 0 || swap >= sameDay.length) return prev
      const a = sameDay[idx]
      const b = sameDay[swap]
      const tmp = a.order
      a.order = b.order
      b.order = tmp
      return prev.map((x) => (x.id === a.id ? a : x.id === b.id ? b : x))
    })
  }

  // ---- service actions ----
  const addService = (name: string, price: number) =>
    setServices((prev) => [...prev, { id: uid(), name, price }])
  const deleteService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id))

  // ---- log actions ----
  const addLogs = (entries: WorkerLog[]) => setLogs((prev) => [...entries, ...prev])
  const deleteLog = (id: string) => setLogs((prev) => prev.filter((l) => l.id !== id))

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: "schedule", label: "Schedule", icon: CalendarClock },
    { key: "workers", label: "Workers", icon: Users },
    { key: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      <div className="flex-1 px-4 pt-6">
        {!ready ? null : tab === "schedule" ? (
          <ScheduleTab
            appointments={appointments}
            date={scheduleDate}
            onDateChange={setScheduleDate}
            onAdd={addAppointment}
            onOpen={setEditing}
            onSetStatus={setApptStatus}
            onReorder={reorder}
            onDelete={deleteAppointment}
          />
        ) : tab === "workers" ? (
          <WorkersTab 
            services={services} 
            logs={logs} 
            onAddLogs={addLogs} 
            onDeleteLog={deleteLog} 
            onAddService={addService}
          />
        ) : (
          <SettingsTab services={services} onAdd={addService} onDelete={deleteService} />
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur">
        <div className="flex items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {tabs.map(({ key, label, icon: Icon }) => {
            const active = tab === key
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-primary/10" : ""
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-[11px] font-semibold">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <VehicleSheet
        open={editing !== null}
        appointment={editing}
        onClose={() => setEditing(null)}
        onSave={saveAppointment}
        onDelete={deleteAppointment}
      />
    </main>
  )
}
