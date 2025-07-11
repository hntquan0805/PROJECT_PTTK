import type { ScheduleOption } from "../types"

// Make schedules mutable for updates
export const AVAILABLE_SCHEDULES: ScheduleOption[] = [
  {
    id: "1",
    date: "2024-02-15",
    time: "09:00",
    type: "english",
    level: "A2",
    availableSlots: 15,
    maxCapacity: 20,
  },
  {
    id: "2",
    date: "2024-02-15",
    time: "14:00",
    type: "english",
    level: "B1",
    availableSlots: 12,
    maxCapacity: 20,
  },
  {
    id: "3",
    date: "2024-02-20",
    time: "09:00",
    type: "it",
    level: "Cơ bản",
    availableSlots: 20,
    maxCapacity: 25,
  },
  {
    id: "4",
    date: "2024-02-20",
    time: "14:00",
    type: "it",
    level: "Nâng cao",
    availableSlots: 8,
    maxCapacity: 15,
  },
  {
    id: "5",
    date: "2024-02-22",
    time: "09:00",
    type: "english",
    level: "B2",
    availableSlots: 0,
    maxCapacity: 20,
  },
]

export const updateScheduleSlots = (scheduleIds: string[]) => {
  scheduleIds.forEach((scheduleId) => {
    const scheduleIndex = AVAILABLE_SCHEDULES.findIndex((s) => s.id === scheduleId)
    if (scheduleIndex !== -1 && AVAILABLE_SCHEDULES[scheduleIndex].availableSlots > 0) {
      AVAILABLE_SCHEDULES[scheduleIndex].availableSlots -= 1
    }
  })
}

export const getUpdatedSchedules = () => [...AVAILABLE_SCHEDULES]

export const getCertificateTypeLabel = (type: string) => {
  return type === "english" ? "Tiếng Anh" : "Tin học"
}

export const getCertificateTypeColor = (type: string) => {
  return type === "english" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
}

export const getScheduleStatusColor = (availableSlots: number, maxCapacity: number) => {
  const ratio = availableSlots / maxCapacity
  if (ratio === 0) return "text-red-600"
  if (ratio < 0.3) return "text-orange-600"
  return "text-green-600"
}
