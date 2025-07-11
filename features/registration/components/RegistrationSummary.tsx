import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, FileText } from "lucide-react"
import { getCertificateTypeLabel, getCertificateTypeColor } from "../constants"
import type { RegistrationInfoForm } from "../schemas"

interface RegistrationSummaryProps {
  registrationInfo: RegistrationInfoForm
}

export function RegistrationSummary({ registrationInfo }: RegistrationSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thông tin người đăng ký - Read only */}
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin người đăng ký
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Loại khách hàng</Label>
              <Badge variant="outline" className="w-fit">
                {registrationInfo.customerType === "individual" ? "Khách hàng tự do" : "Đơn vị"}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input value={registrationInfo.registrantName || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input value={registrationInfo.registrantPhone || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={registrationInfo.registrantEmail || "Không có"} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin thí sinh - Read only */}
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin thí sinh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Họ và tên thí sinh</Label>
              <Input value={registrationInfo.examineeName || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>CCCD/CMND</Label>
              <Input value={registrationInfo.examineeId || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input value={registrationInfo.examineePhone || "Không có"} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={registrationInfo.examineeEmail || "Không có"} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lịch thi đã chọn */}
      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lịch thi và chứng chỉ đã chọn
          </CardTitle>
          <CardDescription>Tổng cộng {registrationInfo.selectedSchedules.length} lịch thi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {registrationInfo.selectedSchedules.map((schedule, index) => (
              <div key={schedule.id} className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getCertificateTypeColor(schedule.type)}>
                    {getCertificateTypeLabel(schedule.type)} - {schedule.level}
                  </Badge>
                  <span className="text-sm text-gray-500 font-medium">Lịch #{index + 1}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Ngày thi: {new Date(schedule.date).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Giờ thi: {schedule.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
