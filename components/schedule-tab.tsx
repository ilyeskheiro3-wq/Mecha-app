"use client"

import { useMemo, useState, useEffect } from "react"
import {
  Plus,
  Clock,
  ArrowDownUp,
  ListOrdered,
  ChevronUp,
  ChevronDown,
  CircleDot,
  CalendarDays,
  LogIn,
  CheckCircle2,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { EmptyState } from "@/components/primitives"
import {
  type Appointment,
  type ApptStatus,
  type ServiceKind,
  SERVICE_LABEL,
  STATUS_LABEL,
  durationOf,
  partsTotal,
  formatDA,
} from "@/lib/types"
import { buildSchedule, minutesToTime } from "@/lib/scheduling"

type SortMode = "manual" | "time"

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const STATUS_STYLE: Record<ApptStatus, string> = {
  waiting: "bg-secondary text-secondary-foreground",
  inside: "bg-accent text-accent-foreground",
  finished: "bg-muted text-muted-foreground",
}

function ServiceChips({ services }: { services: ServiceKind[] }) {
  if (services.length === 0) return <span className="text-xs text-muted-foreground">No service set</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {services.map((s) => (
        <span
          key={s}
          className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
        >
          {SERVICE_LABEL[s]}
        </span>
      ))}
    </div>
  )
}

export function ScheduleTab({
  appointments,
  date,
  onDateChange,
  onAdd,
  onOpen,
  onSetStatus,
  onReorder,
  onDelete,
}: {
  appointments: Appointment[]
  date: string
  onDateChange: (date: string) => void
  onAdd: () => void
  onOpen: (a: Appointment) => void
  onSetStatus: (id: string, status: ApptStatus, arrivalTime?: string, estimatedDuration?: number, garage?: 1 | 2) => void
  onReorder: (id: string, dir: -1 | 1) => void
  onDelete: (id: string) => void
}) {
  const [sort, setSort] = useState<SortMode>("manual")
  const [showArrivalModal, setShowArrivalModal] = useState(false)
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)
  const [arrivalTime, setArrivalTime] = useState("")
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [selectedGarage, setSelectedGarage] = useState<1 | 2>(1)
  const [nowMin, setNowMin] = useState(() => {
    const d = new Date()
    return d.getHours() * 60 + d.getMinutes()
  })

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date()
      setNowMin(d.getHours() * 60 + d.getMinutes())
    }, 30000)
    return () => clearInterval(t)
  }, [])

  const isToday = date === todayISO()

  const handleMoveToGarage = (appt: Appointment) => {
    setSelectedAppt(appt)
    // Pre-fill with current time
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setArrivalTime(currentTime)
    // Pre-fill with estimated duration based on services
    setEstimatedDuration(durationOf(appt.services).toString())
    setSelectedGarage(1)
    setShowArrivalModal(true)
  }

  const confirmMoveToGarage = () => {
    if (selectedAppt && arrivalTime && estimatedDuration) {
      onSetStatus(
        selectedAppt.id, 
        "inside", 
        arrivalTime, 
        parseInt(estimatedDuration), 
        selectedGarage
      )
      setShowArrivalModal(false)
      setSelectedAppt(null)
    }
  }

  const ordered = useMemo(() => {
    const list = appointments.filter((a) => a.date === date)
    if (sort === "time") {
      list.sort((a, b) => a.time.localeCompare(b.time))
    } else {
      list.sort((a, b) => a.order - b.order)
    }
    return list
  }, [appointments, date, sort])

  const scheduled = useMemo(() => buildSchedule(ordered, nowMin), [ordered, nowMin])

  const pending = scheduled.filter((s) => s.appt.status !== "finished").length

  return (
    <div className="flex flex-col gap-4 pb-28">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Schedule</h1>
          <p className="text-sm text-muted-foreground">
            {pending} car{pending === 1 ? "" : "s"} in queue
          </p>
        </div>
        <div className="flex rounded-xl bg-secondary p-1">
          <button
            onClick={() => setSort("manual")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              sort === "manual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <ListOrdered className="size-3.5" />
            My order
          </button>
          <button
            onClick={() => setSort("time")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              sort === "time" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <ArrowDownUp className="size-3.5" />
            By time
          </button>
        </div>
      </header>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
        <CalendarDays className="size-5 text-primary" />
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="flex-1 bg-transparent text-base font-semibold text-foreground outline-none"
        />
        {!isToday ? (
          <button
            onClick={() => onDateChange(todayISO())}
            className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
          >
            Today
          </button>
        ) : null}
      </div>

      {scheduled.length === 0 ? (
        <EmptyState
          icon={<Clock className="size-6" />}
          title={isToday ? "No vehicles yet" : "Nothing on this day"}
          hint={
            isToday
              ? "Add a car and its rendez-vous time. The app figures out who enters the garage and when."
              : "Pick another day, or switch back to today to add cars."
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {scheduled.map((item, index) => {
            const { appt, startMin, endMin, minutesUntilEnter, shouldEnter } = item
            const total = partsTotal(appt.parts)
            const finished = appt.status === "finished"

            const enterLabel =
              appt.status === "inside"
                ? "In the bay now"
                : shouldEnter
                  ? "Ready — should enter now"
                  : `Enter in ${minutesUntilEnter} min`

            return (
              <li
                key={appt.id}
                className={`overflow-hidden rounded-2xl border bg-card transition-shadow ${
                  appt.status === "inside"
                    ? "border-accent/60 shadow-md shadow-accent/10"
                    : !finished && shouldEnter
                      ? "border-primary/50 shadow-md shadow-primary/10"
                      : "border-border"
                }`}
              >
                <div className="flex">
                  <button onClick={() => onOpen(appt)} className="flex flex-1 items-start gap-3 p-4 text-left">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-extrabold tabular-nums leading-none text-foreground">
                        {appt.time || "--:--"}
                      </span>
                      <span className="mt-1 text-[10px] font-medium text-muted-foreground">booked</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-bold text-foreground">
                          {appt.vehicle || appt.plate || "Vehicle"}
                        </p>
                        {appt.vehicle && appt.plate ? (
                          <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {appt.plate}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1.5">
                        <ServiceChips services={appt.services} />
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className={`rounded-md px-2 py-0.5 font-semibold ${STATUS_STYLE[appt.status]}`}>
                          {STATUS_LABEL[appt.status]}
                        </span>
                        {appt.services.length > 0 && !finished ? (
                          <span
                            className={`flex items-center gap-1 ${
                              shouldEnter && appt.status === "waiting" ? "font-semibold text-primary" : "text-muted-foreground"
                            }`}
                          >
                            <CircleDot className="size-3" />
                            {enterLabel}
                          </span>
                        ) : null}
                      </div>
                      {appt.services.length > 0 && !finished ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Bay {minutesToTime(startMin)} - {minutesToTime(endMin)} ({durationOf(appt.services)} min)
                          {appt.garage && appt.status === "inside" ? (
                            <span className="ml-1 font-semibold text-primary">· Garage {appt.garage}</span>
                          ) : null}
                          {total > 0 ? (
                            <span className="ml-1 font-semibold text-foreground">· {formatDA(total)}</span>
                          ) : null}
                        </p>
                      ) : total > 0 ? (
                        <p className="mt-2 text-xs font-semibold text-foreground">{formatDA(total)}</p>
                      ) : null}
                    </div>
                  </button>

                  <div className="flex w-16 flex-col border-l border-border">
                    {appt.status === "waiting" ? (
                      <button
                        onClick={() => handleMoveToGarage(appt)}
                        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-primary"
                        aria-label="Mark in the bay"
                      >
                        <LogIn className="size-5" />
                        <span className="text-[9px] font-bold leading-none">In bay</span>
                      </button>
                    ) : appt.status === "inside" ? (
                      <button
                        onClick={() => onSetStatus(appt.id, "finished")}
                        className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-accent text-accent-foreground"
                        aria-label="Mark finished"
                      >
                        <CheckCircle2 className="size-5" />
                        <span className="text-[9px] font-bold leading-none">Finish</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSetStatus(appt.id, "waiting")}
                        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-muted-foreground"
                        aria-label="Reset status"
                      >
                        <RotateCcw className="size-5" />
                        <span className="text-[9px] font-bold leading-none">Undo</span>
                      </button>
                    )}
                    {sort === "manual" ? (
                      <div className="grid grid-cols-2 border-t border-border">
                        <button
                          onClick={() => onReorder(appt.id, -1)}
                          disabled={index === 0}
                          className="flex items-center justify-center py-1.5 text-muted-foreground disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button
                          onClick={() => onReorder(appt.id, 1)}
                          disabled={index === scheduled.length - 1}
                          className="flex items-center justify-center border-l border-border py-1.5 text-muted-foreground disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                    ) : null}
                    <button
                      onClick={() => onDelete(appt.id)}
                      className="flex items-center justify-center gap-1 border-t border-border py-2 text-destructive"
                      aria-label="Remove from schedule"
                    >
                      <Trash2 className="size-4" />
                      <span className="text-[9px] font-bold leading-none">Remove</span>
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {isToday ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 mx-auto flex max-w-md justify-end px-5">
          <button
            onClick={onAdd}
            className="pointer-events-auto flex h-14 items-center gap-2 rounded-full bg-primary pl-5 pr-6 text-primary-foreground shadow-lg shadow-primary/30 active:scale-95"
          >
            <Plus className="size-5" />
            <span className="font-semibold">Add car</span>
          </button>
        </div>
      ) : null}

      {/* Arrival Time Modal */}
      {showArrivalModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-foreground">Car arrived in garage</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Actual arrival time
                </label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Estimated duration (minutes)
                </label>
                <input
                  type="number"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Garage bay
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGarage(1)}
                    className={`flex-1 rounded-lg border-2 py-3 font-semibold transition-colors ${
                      selectedGarage === 1
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    Garage 1
                  </button>
                  <button
                    onClick={() => setSelectedGarage(2)}
                    className={`flex-1 rounded-lg border-2 py-3 font-semibold transition-colors ${
                      selectedGarage === 2
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    Garage 2
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowArrivalModal(false)
                  setSelectedAppt(null)
                }}
                className="flex-1 rounded-lg border border-border bg-secondary px-4 py-3 font-semibold text-secondary-foreground"
              >
                Cancel
              </button>
              <button
                onClick={confirmMoveToGarage}
                disabled={!arrivalTime || !estimatedDuration}
                className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
