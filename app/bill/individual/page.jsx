"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import IndividualBillForm from "@/app/components/individual-bill-form"
import SuccessScreen from "@/app/components/success-screen"

export default function IndividualBillPage() {
  const [billData, setBillData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const thanhToanId = searchParams.get("id")
  
  useEffect(() => {
    async function fetchBillData() {
      if (!thanhToanId) {
        setError("Không tìm thấy mã thanh toán")
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`/api/thanh-toan?id=${thanhToanId}`)
        
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu")
        }
        
        const data = await response.json()
        
        if (!data) {
          throw new Error("Không tìm thấy thông tin thanh toán")
        }
        
        // Chuyển đổi dữ liệu từ server về dạng dữ liệu dùng cho form
        const mappedData = {
          id: data.thanhToanId,
          customerName: data.customerName || "",
          email: data.email || "",
          phone: data.phone || "",
          certificate: data.certificate || "",
          registrationDate: data.registrationDate || "",
          dueDate: data.dueDate || "",
          paymentDeadline: data.hanThanhToan ? data.hanThanhToan.split('T')[0] : "",
          originalAmount: data.soTienBanDau || 0,
          totalAmount: data.tongSoTien || 0,
          paymentMethod: "",
          notes: ""
        }
        
        setBillData(mappedData)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBillData()
  }, [thanhToanId])
  
  const handleCancel = () => {
    router.push("/bill")
  }
  
  const handleSubmit = (data) => {
    setShowSuccess(true)
  }
  
  const handleComplete = () => {
    router.push("/bill")
  }
  
  const handleResendEmail = () => {
    // Thực hiện logic gửi lại email
    alert("Đã gửi lại email!")
  }
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Đang tải...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-red-600 text-lg mb-4">
          <span className="font-bold">Lỗi:</span> {error}
        </div>
        <button
          onClick={() => router.push("/bill")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Quay lại
        </button>
      </div>
    )
  }
  
  if (showSuccess) {
    return (
      <SuccessScreen
        bill={billData}
        onComplete={handleComplete}
        onResendEmail={handleResendEmail}
      />
    )
  }
  
  return (
    <IndividualBillForm
      bill={billData}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      loading={loading}
    />
  )
} 