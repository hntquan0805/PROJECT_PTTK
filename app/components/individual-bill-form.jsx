"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Calendar, CreditCard, FileText, Mail, Phone } from "lucide-react"
import BillPreview from "./bill-preview"

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
  const [showPreview, setShowPreview] = useState(false)
  const [billCreated, setBillCreated] = useState(null)

  useEffect(() => {
    if (bill) {
      // Set ngày thanh toán mặc định là ngày hôm nay
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const currentDate = `${year}-${month}-${day}`;
      
      setFormData({
        ...bill,
        paymentDate: currentDate
      })
    }
  }, [bill])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      // Validate form
      if (!formData.paymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán")
        setIsSubmitting(false)
        return
      }
      
      // Gọi API để tạo hóa đơn và thanh toán
      const response = await fetch("/api/thanh-toan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          billData: formData,
          isIndividual: true  // Đánh dấu là khách hàng cá nhân
        }),
      })

      const result = await response.json()
      
      if (response.ok) {
        setBillCreated({
          ...formData,
          hoaDonId: result.hoaDonId
        })
        setShowPreview(true)
      } else {
        alert(`Lập hóa đơn thất bại: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      alert("Lỗi kết nối! Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackFromPreview = () => {
    setShowPreview(false)
  }

  const handleComplete = () => {
    onSubmit(formData)
  }

  if (showPreview && billCreated) {
    return (
      <BillPreview 
        bill={billCreated} 
        onComplete={handleComplete}
        onBack={handleBackFromPreview}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với nút quay lại */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">Lập hóa đơn thanh toán</h1>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="w-3 h-3" />
            Khách hàng cá nhân
          </Badge>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Thông tin khách hàng */}
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <User className="w-5 h-5" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Mã phiếu</Label>
                  <Input 
                    value={formData.id || ""} 
                    readOnly 
                    className="bg-gray-50 border-gray-200 text-gray-600"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Chứng chỉ</Label>
                  <Input 
                    value={formData.certificate || ""} 
                    readOnly
                    className="bg-gray-50 border-gray-200 text-gray-600"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tên khách hàng
                </Label>
                <Input 
                  value={formData.customerName || ""} 
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input 
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </Label>
                  <Input 
                    value={formData.phone || ""} 
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ngày đăng ký
                  </Label>
                  <Input 
                    value={formData.registrationDate || ""}
                    readOnly
                    className="bg-gray-50 border-gray-200 text-gray-600"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ngày thi
                  </Label>
                  <Input 
                    value={formData.dueDate || ""}
                    readOnly
                    className="bg-gray-50 border-gray-200 text-gray-600"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Hạn thanh toán
                  </Label>
                  <Input 
                    value={formData.paymentDeadline || ""}
                    className="text-red-600 bg-red-50 border-red-200 font-medium"
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin thanh toán */}
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CreditCard className="w-5 h-5" />
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Số tiền gốc</Label>
                  <Input 
                    value={`${formData.originalAmount?.toLocaleString() || 0} đ`} 
                    readOnly
                    className="bg-gray-50 border-gray-200 font-medium text-gray-900"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Tổng thanh toán</Label>
                  <Input 
                    value={`${formData.totalAmount?.toLocaleString() || 0} đ`} 
                    readOnly
                    className="bg-green-50 border-green-200 font-bold text-green-700 text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Phương thức thanh toán
                  </Label>
                  <Select
                    value={formData.paymentMethod || ""}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tiền mặt">💵 Tiền mặt</SelectItem>
                      <SelectItem value="Chuyển khoản">🏦 Chuyển khoản</SelectItem>
                      <SelectItem value="Thẻ tín dụng">💳 Thẻ tín dụng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ngày thanh toán
                  </Label>
                  <Input 
                    type="date"
                    value={formData.paymentDate || ""}
                    onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Ghi chú
                </Label>
                <Textarea 
                  value={formData.notes || ""} 
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập ghi chú cho hóa đơn..."
                />
              </div>


            </CardContent>
          </Card>
        </div>

        {/* Footer với các nút */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>Vui lòng kiểm tra thông tin trước khi lập hóa đơn</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              disabled={isSubmitting}
              className="px-6"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || isSubmitting} 
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Lập hóa đơn
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 