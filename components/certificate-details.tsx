"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, FileText, Phone, Mail, ArrowLeft } from "lucide-react"
import type { CertificateDetailsData } from "@/lib/models/certificate.model"

type CertificateDetailsProps = {
  data: CertificateDetailsData
  onBack: () => void
}

export default function CertificateDetails({ data, onBack }: CertificateDetailsProps) {
  const { certificate, candidate, notes } = data

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" /> Tra cứu mới
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Chi tiết chứng chỉ{" "}
            <span className="text-gray-500 text-xl ml-2">Mã chứng chỉ: {certificate.maChungChi}</span>
          </h1>
        </div>

        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription>Chứng chỉ này đã được cấp và có hiệu lực đến {certificate.coHieuLucDen}.</AlertDescription>
        </Alert>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" /> Thông tin chứng chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500">Mã chứng chỉ</span>
              <span className="font-medium">{certificate.maChungChi}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Ngày thi</span>
              <span className="font-medium">{certificate.ngayThi}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Số chứng chỉ</span>
              <span className="font-medium">{certificate.soChungChi}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Điểm thi</span>
              <span className="font-medium flex items-center gap-2">
                {certificate.diemThi}{" "}
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Đạt
                </Badge>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Loại chứng chỉ</span>
              <span className="font-medium">{certificate.loaiChungChi}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Ngày cấp</span>
              <span className="font-medium">{certificate.ngayCap}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Cấp độ</span>
              <span className="font-medium">{certificate.capDo}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Có hiệu lực đến</span>
              <span className="font-medium">{certificate.coHieuLucDen}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Trạng thái</span>
              <span className="font-medium flex items-center gap-1">
                <FileText className="w-4 h-4 text-gray-500" /> {certificate.trangThai}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Đơn vị cấp</span>
              <span className="font-medium">{certificate.donViCap}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" /> Thông tin thí sinh
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500">Họ và tên</span>
              <span className="font-medium">{candidate.hoVaTen}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Ngày sinh</span>
              <span className="font-medium">{candidate.ngaySinh}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500"></span>
              <span className="font-medium flex items-center gap-1">
                <Phone className="w-4 h-4 text-gray-500" /> {candidate.dienThoai}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500"></span>
              <span className="font-medium flex items-center gap-1">
                <Mail className="w-4 h-4 text-gray-500" /> {candidate.email}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{notes}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
