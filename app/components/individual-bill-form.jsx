"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function IndividualBillForm({ bill, onCancel, onSubmit, loading }) {
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
    totalAmount: 0,
    paymentMethod: "",
    paymentDate: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (bill) {
      setFormData(bill)
    }
  }, [bill])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      // Gọi API để tạo hóa đơn
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billData: formData }),
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(`Hóa đơn đã được tạo và gửi email thành công!`)
        onSubmit(formData)
      } else {
        alert(`Gửi email thất bại: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      alert("Lỗi kết nối! Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lập hóa đơn thanh toán</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin khách hàng */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4 text-blue-800">Thông tin khách hàng</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Mã phiếu</Label>
              <Input 
                value={formData.id || ""} 
                readOnly 
                className="bg-white"
              />
            </div>

            <div>
              <Label>Tên khách hàng</Label>
              <Input 
                value={formData.customerName || ""} 
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <Label>Số điện thoại</Label>
              <Input 
                value={formData.phone || ""} 
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <Label>Chứng chỉ</Label>
              <Input 
                value={formData.certificate || ""} 
                readOnly
                className="bg-white"
              />
            </div>
            
            <div>
              <Label>Ngày đăng ký</Label>
              <Input 
                value={formData.registrationDate || ""}
                readOnly
                className="bg-white"
              />
            </div>
            
            <div>
              <Label>Ngày thi</Label>
              <Input 
                value={formData.dueDate || ""}
                readOnly
                className="bg-white"
              />
            </div>
            
            <div>
              <Label>Hạn thanh toán</Label>
              <Input 
                value={formData.paymentDeadline || ""}
                className="text-red-600 bg-white"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Thông tin thanh toán</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Số tiền gốc</Label>
              <Input 
                value={`${formData.originalAmount?.toLocaleString() || 0} đ`} 
                readOnly
                className="bg-white font-medium"
              />
            </div>

            <div>
              <Label>Tổng thanh toán</Label>
              <Input 
                value={`${formData.totalAmount?.toLocaleString() || 0} đ`} 
                readOnly
                className="bg-white font-bold text-blue-700"
              />
            </div>

            <div>
              <Label>Phương thức thanh toán</Label>
              <Select
                value={formData.paymentMethod || ""}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                  <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  <SelectItem value="Thẻ tín dụng">Thẻ tín dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ngày thanh toán</Label>
              <Input 
                type="date"
                value={formData.paymentDate || ""}
                onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <Label>Ghi chú</Label>
              <Textarea 
                value={formData.notes || ""} 
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="min-h-[100px] bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || isSubmitting} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận và tạo hóa đơn"}
        </Button>
      </div>
    </div>
  )
} 