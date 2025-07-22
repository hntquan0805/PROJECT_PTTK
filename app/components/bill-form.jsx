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
    status: "pending_billing",
    loaiKhachHang: "",
    soLuongThiSinh: 1,
    troGiaID: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [troGiaOptions, setTroGiaOptions] = useState([])
  const [selectedTroGia, setSelectedTroGia] = useState(null)

  useEffect(() => {
    const fetchTroGiaOptions = async () => {
      try {
        const response = await fetch("/api/tro-gia")
        if (response.ok) {
          const data = await response.json()
          console.log("Fetched TroGia options:", data)
          setTroGiaOptions(data)
        } else {
          console.error("Failed to fetch TroGia options")
        }
      } catch (error) {
        console.error("Error fetching TroGia options:", error)
      }
    }
    fetchTroGiaOptions()
  }, [])

  useEffect(() => {
    if (bill) {
      setFormData(bill)
    }

    if (troGiaOptions.length > 0) {
        const suggestedTroGia = determineSuggestedTroGia(bill.soLuongThiSinh, troGiaOptions)
        if (suggestedTroGia) {
          handleTroGiaChange(suggestedTroGia.troGiaId, bill.originalAmount, suggestedTroGia)
        } else {
          setFormData((prev) => ({
            ...prev,
            troGiaId: "",
          }))
          setSelectedTroGia(null)
        }
      }
  }, [bill, troGiaOptions])

  const determineSuggestedTroGia = (soLuongThiSinh, options) => {
    const sortedOptions = [...options].sort((a, b) => a.soThiSinhToiThieu - b.soThiSinhToiThieu)

    let bestMatch = null

    for (let i = 0; i < sortedOptions.length; i++) {
      const currentTroGia = sortedOptions[i]
      const nextTroGia = sortedOptions[i + 1]

      if (soLuongThiSinh >= currentTroGia.soThiSinhToiThieu) {
        if (!nextTroGia || soLuongThiSinh < nextTroGia.soThiSinhToiThieu) {
          bestMatch = currentTroGia
          break
        }
      }
    }

    console.log(bestMatch)
    return bestMatch
  }

  const handleTroGiaChange = (troGiaId, currentOriginalAmount = formData.originalAmount, specificTroGia = null) => {
    const selected = specificTroGia || troGiaOptions.find((opt) => opt.troGiaId === troGiaId)

    setSelectedTroGia(selected)

    setFormData((prev) => {
      let newDiscount = 0
      let newTotalAmount = currentOriginalAmount

      if (selected) {
        newDiscount = selected.tiLeGiamGia
        newTotalAmount = currentOriginalAmount * (1 - newDiscount / 100)
      } else {
        newDiscount = 0
        newTotalAmount = currentOriginalAmount
      }

      return {
        ...prev,
        discount: newDiscount,
        totalAmount: newTotalAmount,
        troGiaId: selected ? selected.troGiaId : "",
      }
    })
  }

  const handleSendEmail = async () => {
    if (isSubmitting) return

    const data = {
      ...formData,
      id: formData.id,
      createdDate: new Date().toISOString().split("T")[0],
      paymentDeadline: new Date(Date(formData.registrationDate) + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }

    setIsSubmitting(true)

    try {
      // Send email and create bill record
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("Phieu thanh toan created successfully:", result.phieuTTId)
        alert(`Phieu thanh toan ${result.phieuTTId} đã được tạo và gửi email thành công!`)
        onSendEmail(data)
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
      <h1 className="text-2xl font-bold mb-6">Lập phiếu thanh toán</h1>

      <div className="flex flex-row lg:flex-row gap-6">
        {/* Customer Information */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-blue-600">Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Mã phiếu đăng ký</Label>
              <Input value={formData.id || ""} readOnly />
            </div>

            <div>
              <Label>Tên khách hàng</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.customerName || ""} readOnly
                />
                <Badge variant="outline">{formData.loaiKhachHang}</Badge>
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email || ""} readOnly />
            </div>

            <div>
              <Label>Số điện thoại</Label>
              <Input value={formData.phone || ""} readOnly />
            </div>

            <div>
              <Label>Chứng chỉ</Label>
              <Input value={formData.loaiChungChi || ""} readOnly />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600">
                <span>📧</span>
                <span>Phiếu sẽ được gửi qua email đến khách hàng</span>
              </div>
            </div>

            <div>
              <Label>Số thí sinh</Label>
              <div className="flex items-center gap-2">
                <Input value={formData.soLuongThiSinh || ""} readOnly />
                <span className="text-sm text-gray-500">Có thể bạn được tặng giá 10%</span>
              </div>
            </div>

            <div>
              <Label>Ngày đăng ký</Label>
              <Input value={formData.registrationDate || ""} readOnly />
            </div>

            <div>
              <Label>Ngày thi</Label>
              <Input value={formData.dueDate || ""} readOnly />
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
                readOnly
              />
            </div>

            <div>
              <Label>Giảm giá (%)</Label>
              <Input
                type="number"
                value={formData.discount || ""}
                readOnly
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
