export type ServiceKind = "moteur" | "boite"

// Duration in minutes for each vidange type
export const SERVICE_DURATION: Record<ServiceKind, number> = {
  moteur: 30,
  boite: 120,
}

export const SERVICE_LABEL: Record<ServiceKind, string> = {
  moteur: "Vidange Moteur",
  boite: "Vidange Boîte",
}

export type OilPricingMode = "per1L" | "per5L"

export type Parts = {
  // Oil: price and liters used
  oilPricePer5L: number
  oilLitersUsed: number
  oilPricingMode: OilPricingMode // "per1L" or "per5L"
  filtreHuile: number
  filtreAir: number
  filtreGasoil: number
  filtreClima: number
  plaquettes: number
  mainDoeuvre: number // price that you type manually
}

export const EMPTY_PARTS: Parts = {
  oilPricePer5L: 0,
  oilLitersUsed: 0,
  oilPricingMode: "per5L",
  filtreHuile: 0,
  filtreAir: 0,
  filtreGasoil: 0,
  filtreClima: 0,
  plaquettes: 0,
  mainDoeuvre: 0,
}

export type ApptStatus = "waiting" | "inside" | "finished"

export const STATUS_LABEL: Record<ApptStatus, string> = {
  waiting: "Not arrived",
  inside: "In the bay",
  finished: "Finished",
}

export type Appointment = {
  id: string
  vehicle: string
  plate: string
  phone: string
  km: number // kilometers crossed (optional, 0 = unset)
  oilType: string // type of oil (optional)
  services: ServiceKind[]
  time: string // "HH:MM" - scheduled time
  arrivalTime?: string // "HH:MM" - actual arrival time
  estimatedDuration?: number // in minutes
  garage?: 1 | 2 // garage bay number
  date: string // "YYYY-MM-DD"
  order: number
  status: ApptStatus
  parts: Parts
}

export type WorkerService = {
  id: string
  name: string
  price: number
}

export type WorkerLog = {
  id: string
  worker: string
  date: string // "YYYY-MM-DD"
  serviceId: string
  serviceName: string
  price: number
  note: string
}

// ---- derived money helpers ----
export function oilCost(parts: Parts): number {
  if (!parts.oilPricePer5L || !parts.oilLitersUsed) return 0
  
  if (parts.oilPricingMode === "per1L") {
    // Price is per liter, multiply by liters used
    return parts.oilPricePer5L * parts.oilLitersUsed
  } else {
    // Price is per 5L, divide by 5 then multiply by liters used
    return (parts.oilPricePer5L / 5) * parts.oilLitersUsed
  }
}

export function partsTotal(parts: Parts): number {
  return (
    oilCost(parts) +
    parts.filtreHuile +
    parts.filtreAir +
    parts.filtreGasoil +
    parts.filtreClima +
    parts.plaquettes +
    parts.mainDoeuvre
  )
}

export function durationOf(services: ServiceKind[]): number {
  return services.reduce((sum, s) => sum + SERVICE_DURATION[s], 0)
}

export function formatDA(n: number): string {
  const rounded = Math.round(n)
  return `${rounded.toLocaleString("en-US")} DA`
}
