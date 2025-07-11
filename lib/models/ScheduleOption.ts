interface ScheduleOption {
  id: string;
  date: string;
  time: string;
  type: "english" | "it";
  level: string;
  availableSlots: number;
  maxCapacity: number;
}
export default ScheduleOption;
