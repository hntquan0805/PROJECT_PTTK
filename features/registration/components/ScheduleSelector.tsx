import type { UseFormReturn } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import {
  AVAILABLE_SCHEDULES,
  getCertificateTypeLabel,
  getCertificateTypeColor,
  getScheduleStatusColor,
} from "../constants"
import type { RegistrationInfoForm } from "../schemas"
import type { SelectedSchedule } from "../types"

interface ScheduleSelectorProps {
  form: UseFormReturn<RegistrationInfoForm>
}

export function ScheduleSelector({ form }: ScheduleSelectorProps) {
  const watchedSelectedSchedules = form.watch("selectedSchedules")

  const handleScheduleSelection = (scheduleId: string, checked: boolean) => {
    const schedule = AVAILABLE_SCHEDULES.find((s) => s.id === scheduleId)
    if (!schedule) return

    if (checked && schedule.availableSlots === 0) {
      toast.warning("Lịch thi đã hết chỗ!", {
        description: `${getCertificateTypeLabel(schedule.type)} - ${schedule.level} vào ${schedule.time} ngày ${new Date(schedule.date).toLocaleDateString("vi-VN")} đã đầy`,
      })
      return
    }

    const currentSchedules = form.getValues("selectedSchedules")

    if (checked) {
      const newSchedule: SelectedSchedule = {
        id: schedule.id,
        date: schedule.date,
        time: schedule.time,
        type: schedule.type,
        level: schedule.level,
      }
      form.setValue("selectedSchedules", [...currentSchedules, newSchedule], {
        shouldValidate: true,
      })

      toast.success("Đã thêm lịch thi", {
        description: `${getCertificateTypeLabel(schedule.type)} - ${schedule.level}`,
        duration: 2000,
      })
    } else {
      form.setValue(
        "selectedSchedules",
        currentSchedules.filter((s) => s.id !== scheduleId),
        { shouldValidate: true },
      )

      toast.info("Đã bỏ chọn lịch thi", {
        description: `${getCertificateTypeLabel(schedule.type)} - ${schedule.level}`,
        duration: 2000,
      })
    }
  }

  return (
    <Card id="schedule-selection" className="transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Chọn lịch thi và loại chứng chỉ *
        </CardTitle>
        <CardDescription>
          Chọn các lịch thi và loại chứng chỉ mong muốn
          {watchedSelectedSchedules.length > 0 && (
            <span className="ml-2 text-blue-600 font-medium">(Đã chọn {watchedSelectedSchedules.length} lịch)</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="selectedSchedules"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_SCHEDULES.map((schedule) => {
                  const isSelected = watchedSelectedSchedules?.some((s) => s.id === schedule.id)
                  const isFull = schedule.availableSlots === 0

                  return (
                    <FormField
                      key={schedule.id}
                      control={form.control}
                      name="selectedSchedules"
                      render={() => (
                        <FormItem
                          className={`border rounded-lg p-4 transition-all duration-300 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : isFull
                                ? "border-red-200 bg-red-50 opacity-60"
                                : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={isSelected}
                                disabled={isFull}
                                onCheckedChange={(checked) => handleScheduleSelection(schedule.id, checked as boolean)}
                              />
                            </FormControl>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge className={getCertificateTypeColor(schedule.type)}>
                                  {getCertificateTypeLabel(schedule.type)} - {schedule.level}
                                </Badge>
                                <div className="flex items-center gap-2">
                                  {isFull && <AlertCircle className="h-4 w-4 text-red-500" />}
                                  <span
                                    className={`text-sm font-medium ${getScheduleStatusColor(
                                      schedule.availableSlots,
                                      schedule.maxCapacity,
                                    )}`}
                                  >
                                    {isFull ? "Hết chỗ" : `Còn ${schedule.availableSlots}/${schedule.maxCapacity} chỗ`}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(schedule.date).toLocaleDateString("vi-VN")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {schedule.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  )
                })}
              </div>
              {watchedSelectedSchedules && watchedSelectedSchedules.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Lịch thi đã chọn:</h4>
                  <div className="space-y-1">
                    {watchedSelectedSchedules.map((schedule, index) => (
                      <div key={schedule.id} className="text-sm text-blue-800">
                        {index + 1}. {getCertificateTypeLabel(schedule.type)} - {schedule.level} |{" "}
                        {new Date(schedule.date).toLocaleDateString("vi-VN")} | {schedule.time}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
