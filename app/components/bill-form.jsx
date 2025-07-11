"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function BillForm({ bill, onCancel, onSubmit, onSendEmail, loading }) {
  const [formData, setFormData] = useState({
    id: "",
    customerName: "",
    email: "",
    phone: "",
    certificate: "",
    registrationDate: "",
    dueDate: "",
    paymentDeadline: "",
    originalAmount: 0,
    discount: 0,
    totalAmount: 0,
    paymentMethod: "",
    paymentDate: "",
    notes: "",
    status: "pending",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (bill) {
      setFormData(bill)
    }
  }, [bill])

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Recalculate total when original amount or discount changes
      if (field === "originalAmount" || field === "discount") {
        const original = field === "originalAmount" ? value : updated.originalAmount || 0
        const discountPercent = field === "discount" ? value : updated.discount || 0
        updated.totalAmount = original * (1 - discountPercent / 100)
      }

      return updated
    })
  }

  const handleSendEmail = async () => {
    if (isSubmitting) return

    const billData = {
      ...formData,
      id: formData.id || `REG${Date.now()}`,
      createdDate: new Date().toISOString().split("T")[0],
    }

    setIsSubmitting(true)

    try {
      // Send email and create bill record
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billData }),
      })

      const result = await response.json()
      console.log("API response:", result)

      if (response.ok) {
        console.log("Bill created successfully:", result.hoaDonId)
        alert(`Hóa đơn ${result.hoaDonId} đã được tạo và gửi email thành công!`)
        onSendEmail(billData)
      } else {
        console.error("API error:", result)
        alert(`Gửi email thất bại: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Lỗi kết nối! Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lập hóa đơn thanh toán</h1>

      <div className="flex flex-row lg:flex-row gap-6">
        {/* Customer Information */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-blue-600">Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Mã phiếu</Label>
              <Input value={formData.id || ""} onChange={(e) => handleInputChange("id", e.target.value)} />
            </div>

            <div>
              <Label>Tên khách hàng</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.customerName || ""}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                />
                <Badge variant="outline">Đơn vị</Badge>
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label>Số điện thoại</Label>
              <Input value={formData.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} />
            </div>

            <div>
              <Label>Chứng chỉ</Label>
              <Input
                value={formData.certificate || ""}
                onChange={(e) => handleInputChange("certificate", e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600">
                <span>📧</span>
                <span>Hóa đơn sẽ được gửi qua email đến khách hàng</span>
              </div>
            </div>

            <div>
              <Label>Số thí sinh</Label>
              <div className="flex items-center gap-2">
                <Input value="" readOnly />
                <span className="text-sm text-gray-500">Có thể bạn được tặng giá 10%</span>
              </div>
            </div>

            <div>
              <Label>Ngày đăng ký</Label>
              <Input
                value={formData.registrationDate || ""}
                onChange={(e) => handleInputChange("registrationDate", e.target.value)}
              />
            </div>

            <div>
              <Label>Ngày thi</Label>
              <Input
                value={formData.dueDate || ""}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
              />
            </div>

            <div>
              <Label>Hạn thanh toán</Label>
              <Input
                value={formData.paymentDeadline || ""}
                onChange={(e) => handleInputChange("paymentDeadline", e.target.value)}
                className="text-red-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Thông tin thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Số tiền gốc</Label>
              <Input
                type="number"
                value={formData.originalAmount || ""}
                onChange={(e) => handleInputChange("originalAmount", Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Giảm giá (%)</Label>
              <Input
                type="number"
                value={formData.discount || ""}
                onChange={(e) => handleInputChange("discount", Number(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Giảm giá với hóa đơn 20 thí sinh được giảm 5%, 30 thí sinh được giảm 10%
              </p>
            </div>

            <div>
              <Label>Số tiền giảm</Label>
              <Input
                value={`${(((formData.originalAmount || 0) * (formData.discount || 0)) / 100).toLocaleString()} đ`}
                readOnly
              />
            </div>

            <div>
              <Label>Tổng thanh toán</Label>
              <Input
                value={`${(formData.totalAmount || 0).toLocaleString()} đ`}
                readOnly
                className="font-bold text-blue-600"
              />
            </div>

            <div>
              <Label>Phương thức thanh toán</Label>
              <Select
                value={formData.paymentMethod || ""}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                  <SelectItem value="Thẻ tín dụng">Thẻ tín dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ngày thanh toán</Label>
              <Input
                value={formData.paymentDate || ""}
                onChange={(e) => handleInputChange("paymentDate", e.target.value)}
              />
              <p className="text-xs text-orange-500 mt-1">*Ngày thanh toán sẽ được cập nhật khi có nhận thanh toán</p>
            </div>

            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between gap-4 mt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button onClick={handleSendEmail} disabled={loading || isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Đang xử lý..." : "Xác nhận và gửi qua email"}
        </Button>
      </div>
    </div>
  )
}
