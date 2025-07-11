"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, FileText, MessageSquare } from "lucide-react"

export default function SuccessScreen({ bill, onComplete, onResendEmail }) {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Gửi email thành công!</h1>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            Đã gửi thông báo thanh toán qua email đến: <span className="font-medium">{bill.email}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8 justify-between">
        {/* Bill Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin phiếu thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã phiếu thanh toán:</span>
              <span className="font-medium">INV{bill.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Khách hàng:</span>
              <span className="font-medium">{bill.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-medium">{bill.totalAmount.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="text-orange-600">Chờ xác nhận</span>
            </div>
          </CardContent>
        </Card>

        {/* Email Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tiêu đề:</span>
              <span className="font-medium">Thông báo thanh toán - Mã đăng ký: {bill.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Người nhận:</span>
              <span className="font-medium">{bill.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{bill.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đính kèm:</span>
              <span className="font-medium">Hóa đơn INV{bill.id}.pdf, Thông tin thanh toán.pdf</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Templates */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Gửi lại email với mẫu khác</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Mail className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium mb-1">Mẫu thông báo 1</h3>
              <p className="text-sm text-gray-600">Thông báo thanh toán</p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium mb-1">Mẫu thông báo 2</h3>
              <p className="text-sm text-gray-600">Thông báo + QR code</p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium mb-1">Mẫu thông báo 3</h3>
              <p className="text-sm text-gray-600">Nhắc nhở thanh toán</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onResendEmail}>
          Gửi lại email
        </Button>
        <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700">
          Hoàn tất
        </Button>
      </div>
    </div>
  )
}
