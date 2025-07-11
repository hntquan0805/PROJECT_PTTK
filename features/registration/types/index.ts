export interface ScheduleOption {
  id: string
  date: string
  time: string
  type: "english" | "it"
  level: string
  availableSlots: number
  maxCapacity: number
}

export interface SelectedSchedule {
  id: string
  date: string
  time: string
  type: "english" | "it"
  level: string
}

export interface RegistrationInfo {
  customerType: "individual" | "organization"
  registrantName: string
  registrantPhone: string
  registrantEmail?: string
  examineeName: string
  examineePhone?: string
  examineeEmail?: string
  examineeId: string
  selectedSchedules: SelectedSchedule[]
}

export interface CreateRegistrationData {
  confirmed: boolean
  notes?: string
}

export type RegistrationStep = "input" | "create"
