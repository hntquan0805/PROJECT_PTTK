"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { registrationInfoSchema, type RegistrationInfoForm as RegistrationInfoFormType } from "../schemas"
import { RegistrantInfoForm } from "./RegistrantInfoForm"
import { ExamineeInfoForm } from "./ExamineeInfoForm"
import { ScheduleSelector } from "./ScheduleSelector"

interface RegistrationInfoFormProps {
  onSubmit: (data: RegistrationInfoFormType) => Promise<void>
  onReset: () => void
}

export function RegistrationInfoForm({ onSubmit, onReset }: RegistrationInfoFormProps) {
  const form = useForm<RegistrationInfoFormType>({
    resolver: zodResolver(registrationInfoSchema),
    defaultValues: {
      customerType: "individual", // Always individual for free registration
      registrantName: "",
      registrantPhone: "",
      registrantEmail: "",
      examineeName: "",
      examineePhone: "",
      examineeEmail: "",
      examineeId: "",
      selectedSchedules: [],
    },
    mode: "onChange",
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RegistrantInfoForm form={form} />
          <ExamineeInfoForm form={form} />
        </div>

        <ScheduleSelector form={form} />

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <Button type="button" variant="outline" size="lg" onClick={onReset}>
            <AlertCircle className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="min-w-[180px]">
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Lưu thông tin
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
