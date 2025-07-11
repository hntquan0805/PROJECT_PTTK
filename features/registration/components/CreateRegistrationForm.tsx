"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CheckCircle, AlertCircle, FileText, Loader2, Printer } from "lucide-react"
import { createRegistrationSchema, type CreateRegistrationForm as CreateRegistrationFormType } from "../schemas"
import { PrintDialog } from "./PrintDialog"
import type { RegistrationInfoForm } from "../schemas"

interface CreateRegistrationFormProps {
  onSubmit: (data: CreateRegistrationFormType) => Promise<void>
  onBack: () => void
  registrationInfo: RegistrationInfoForm
  registrationId?: string
  createdDate?: Date
  showPrintSection?: boolean
}

export function CreateRegistrationForm({
  onSubmit,
  onBack,
  registrationInfo,
  registrationId,
  createdDate,
  showPrintSection = false,
}: CreateRegistrationFormProps) {
  const form = useForm<CreateRegistrationFormType>({
    resolver: zodResolver(createRegistrationSchema),
    defaultValues: {
      confirmed: false,
      notes: "",
    },
    mode: "onChange",
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Xác nhận và ghi chú
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="confirmed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        Tôi xác nhận rằng tất cả thông tin trên là chính xác và đã được kiểm tra kỹ lưỡng.
                      </FormLabel>
                      <FormDescription>
                        Sau khi tạo phiếu đăng ký, thông tin sẽ không thể chỉnh sửa. Khách hàng có 3 ngày để thanh toán.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú (không bắt buộc)</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Nhập ghi chú thêm nếu có..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ghi chú sẽ được lưu cùng phiếu đăng ký</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-center gap-4">
            <Button type="button" variant="outline" size="lg" onClick={onBack}>
              <AlertCircle className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting || !form.watch("confirmed")}
              className="min-w-[180px]"
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tạo phiếu
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Print Section - Show after successful creation */}
      {showPrintSection && registrationId && createdDate && (
        <Card
          id="print-section"
          className="transition-shadow duration-300 hover:shadow-lg bg-green-50 border-green-200"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Printer className="h-5 w-5" />
              In phiếu đăng ký
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-green-700">
                <p className="font-medium">✅ Phiếu đăng ký đã được tạo thành công!</p>
                <p className="text-sm">
                  Mã phiếu: <strong>{registrationId}</strong>
                </p>
                <p className="text-sm">
                  Ngày tạo: <strong>{createdDate.toLocaleDateString("vi-VN")}</strong>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <PrintDialog
                  registrationInfo={registrationInfo}
                  registrationId={registrationId}
                  createdDate={createdDate}
                  trigger={
                    <Button className="flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Xem và in phiếu
                    </Button>
                  }
                />
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Tạo phiếu mới
                </Button>
              </div>

              <div className="text-sm text-green-600 bg-green-100 p-3 rounded-lg">
                <p className="font-medium">📋 Hướng dẫn tiếp theo:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>In phiếu đăng ký và đưa cho khách hàng</li>
                  <li>Khách hàng có 3 ngày để thanh toán</li>
                  <li>Sau khi thanh toán, phiếu dự thi sẽ được gửi qua email</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
