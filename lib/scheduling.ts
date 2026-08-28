import { type Appointment, durationOf } from "./types"

export type ScheduledAppointment = {
  appt: Appointment
  startMin: number // projected start (minutes from midnight)
  endMin: number // projected end
  minutesUntilEnter: number // >0 means wait, <=0 means it is time to enter
  shouldEnter: boolean // now is at/after the projected start
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map((v) => Number.parseInt(v, 10))
  if (Number.isNaN(h)) return 0
  return h * 60 + (Number.isNaN(m) ? 0 : m)
}

export function minutesToTime(min: number): string {
  const clamped = ((min % 1440) + 1440) % 1440
  const h = Math.floor(clamped / 60)
  const m = clamped % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

/**
 * Smart engine: given the appointments in the order they should run,
 * project a realistic "enter the garage" time for each car so that
 * one rendez-vous starts only after the previous one is finished.
 * A car can never start before its own booked time. Finished cars no
 * longer occupy the single bay, so they are skipped in the projection.
 */
export function buildSchedule(list: Appointment[], nowMin: number): ScheduledAppointment[] {
  let bayFreeAt = 0 // when the single garage bay becomes free

  return list.map((appt) => {
    if (appt.status === "finished") {
      return { appt, startMin: 0, endMin: 0, minutesUntilEnter: 0, shouldEnter: false }
    }
    const booked = toMinutes(appt.time)
    const duration = durationOf(appt.services)
    const startMin = Math.max(booked, bayFreeAt)
    const endMin = startMin + duration
    bayFreeAt = endMin

    return {
      appt,
      startMin,
      endMin,
      minutesUntilEnter: startMin - nowMin,
      shouldEnter: nowMin >= startMin,
    }
  })
}
