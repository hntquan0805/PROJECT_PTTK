"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Printer, ArrowLeft } from "lucide-react"

export default function BillPreview({ bill, onComplete, onBack }) {
  const [isPrinting, setIsPrinting] = useState(false)
  
  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 300)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    try {
      // Xử lý nhiều định dạng ngày khác nhau
      let date;
      
      // Xử lý định dạng từ SQL Server (yyyy-MM-dd HH:mm:ss.SSS)
      if (dateStr.includes('-') && dateStr.includes(':')) {
        date = new Date(dateStr);
      } 
      // Xử lý định dạng dd/MM/yyyy
      else if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          // Định dạng dd/MM/yyyy
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Tháng trong JS bắt đầu từ 0
          const year = parseInt(parts[2], 10);
          date = new Date(year, month, day);
        } else {
          date = new Date(dateStr);
        }
      } 
      // Xử lý định dạng yyyy-MM-dd
      else if (dateStr.includes('-')) {
        date = new Date(dateStr);
      } 
      else {
        date = new Date(dateStr);
      }
      
      // Kiểm tra xem ngày có hợp lệ không
      if (isNaN(date.getTime())) {
        return dateStr; // Trả về chuỗi gốc nếu không thể chuyển đổi
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return dateStr;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Thanh công cụ */}
      <div className="flex justify-between items-center mb-6 print:hidden max-w-4xl mx-auto">
        <Button 
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 bg-white hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white hover:bg-gray-100"
        >
          <Printer className="w-4 h-4" />
          In hóa đơn
        </Button>
      </div>

      {/* Hóa đơn */}
      <Card className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none border-0">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                <path d="M18 14h-8"></path>
                <path d="M15 18h-5"></path>
                <path d="M10 6h8v4h-8V6Z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">TRUNG TÂM ACCI</h1>
              <p className="text-blue-100 text-sm">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
              <p className="text-blue-100 text-sm">Email: info@trungtam.edu.vn</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">HÓA ĐƠN THANH TOÁN</h2>
            <p className="text-blue-100">Số: {bill.id || 'HĐ001'}</p>
            <p className="text-blue-100">Ngày: {formatDate(bill.paymentDate)}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Thông tin khách hàng */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2 pl-1">
              <svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              <h3 className="font-semibold text-gray-700 text-base">Thông tin khách hàng</h3>
            </div>
            <div className="border-b border-blue-500 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              {/* Cột trái */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-32 min-w-[110px] text-gray-600 text-sm">Mã phiếu:</span>
                  <span className="font-medium">{bill.code || bill.id || 'RG001'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 min-w-[110px] text-gray-600 text-sm">Tên khách hàng:</span>
                  <span className="font-medium">{bill.customerName}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 min-w-[110px] text-gray-600 text-sm">Email:</span>
                  <span>{bill.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 min-w-[110px] text-gray-600 text-sm">Số điện thoại:</span>
                  <span>{bill.phone || 'N/A'}</span>
                </div>
              </div>
              {/* Cột phải */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-32 min-w-[110px] text-gray-600 text-sm">Chứng chỉ:</span>
                  <span className="font-medium">{bill.certificate || "IELTS"}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 min-w-[110px] text-gray-600 text-sm">Ngày đăng ký:</span>
                  <span>{formatDate(bill.registrationDate)}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 min-w-[110px] text-gray-600 text-sm">Ngày thi:</span>
                  <span>{formatDate(bill.dueDate)}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 min-w-[110px] text-gray-600 text-sm">Hạn thanh toán:</span>
                  <span className="text-red-600 font-medium">{formatDate(bill.paymentDeadline)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết dịch vụ */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 pl-1">
              <svg width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              <h3 className="font-semibold text-gray-700 text-base">Chi tiết dịch vụ</h3>
            </div>
            <div className="border-b border-green-500 mb-4"></div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-700 text-left">Dịch vụ</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-700 text-center">Số lượng</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-700 text-right">Đơn giá</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-gray-700 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Lệ phí thi chứng chỉ {bill.certificate || "IELTS"}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{(bill.originalAmount || 4500000)?.toLocaleString()} đ</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{(bill.originalAmount || 4500000)?.toLocaleString()} đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 pl-1">
              <svg width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="7" rx="2"/><path d="M16 11V7a4 4 0 0 0-8 0v4"/></svg>
              <h3 className="font-semibold text-gray-700 text-base">Thông tin thanh toán</h3>
            </div>
            <div className="border-b border-green-500 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Bên trái */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm min-w-[140px]">Phương thức thanh toán:</span>
                  <span className="font-semibold">{bill.paymentMethod || "Tiền mặt"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm min-w-[140px]">Ngày thanh toán:</span>
                  <span>{formatDate(bill.paymentDate)}</span>
                </div>
              </div>
              {/* Bên phải */}
              <div className="flex justify-center md:justify-end mt-4 md:mt-0">
                <div className="bg-green-50 border border-green-300 rounded-lg px-8 py-6 text-center w-full max-w-xs">
                  <div className="text-gray-500 text-sm mb-1">Tổng cộng</div>
                  <div className="text-2xl md:text-3xl font-bold text-green-600">{(bill.totalAmount || bill.originalAmount || 4500000)?.toLocaleString()} đ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer với chữ ký */}
          <div className="border-t border-dashed border-gray-300 pt-6 mt-8">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="font-medium text-gray-700 mb-16">Người lập hóa đơn</p>
                <div className="border-t border-gray-300 pt-2">
                  <p className="text-sm text-gray-600">Ký và ghi rõ họ tên</p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-16">Khách hàng</p>
                <div className="border-t border-gray-300 pt-2">
                  <p className="text-sm text-gray-600">Ký và ghi rõ họ tên</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
              <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
              <p>Mọi thắc mắc xin liên hệ: (028) 1234 5678 - info@trungtam.edu.vn</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}