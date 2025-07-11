"use client"

import { forwardRef } from "react"
import type { RegistrationInfoForm } from "../schemas"

interface PrintPreviewProps {
  registrationInfo: RegistrationInfoForm
  registrationId: string
  createdDate: Date
}

export const PrintPreview = forwardRef<HTMLDivElement, PrintPreviewProps>(
  ({ registrationInfo, registrationId, createdDate }, ref) => {
    const getCertificateTypeLabel = (type: string) => {
      return type === "english" ? "Tiếng Anh" : "Tin học"
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    }

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/images/acci-logo.png" alt="ACCI Logo" className="w-16 h-16" />
            <div>
              <h1 className="text-2xl font-bold text-blue-600">TRUNG TÂM ACCI</h1>
              <p className="text-sm text-gray-600">Tổ chức thi chứng chỉ Anh ngữ và Tin học</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2">
            PHIẾU ĐĂNG KÝ THI CHỨNG CHỈ
          </h2>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              Mã phiếu: <span className="font-bold text-blue-600">{registrationId}</span>
            </p>
            <p>
              Ngày lập: {formatDate(createdDate)} - {formatTime(createdDate)}
            </p>
          </div>
        </div>

        {/* Registration Info */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800 border-b border-gray-300 pb-1">THÔNG TIN NGƯỜI ĐĂNG KÝ</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium w-32">Loại khách hàng:</span>
                <span className="font-bold text-blue-600">
                  {registrationInfo.customerType === "individual" ? "Khách hàng tự do" : "Đơn vị"}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Họ và tên:</span>
                <span className="font-bold">{registrationInfo.registrantName}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Số điện thoại:</span>
                <span>{registrationInfo.registrantPhone}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Email:</span>
                <span>{registrationInfo.registrantEmail || "Không có"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800 border-b border-gray-300 pb-1">THÔNG TIN THÍ SINH</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium w-32">Họ và tên:</span>
                <span className="font-bold">{registrationInfo.examineeName}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">CCCD/CMND:</span>
                <span className="font-bold text-red-600">{registrationInfo.examineeId}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Số điện thoại:</span>
                <span>{registrationInfo.examineePhone || "Không có"}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Email:</span>
                <span>{registrationInfo.examineeEmail || "Không có"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-800 border-b border-gray-300 pb-1 mb-4">
            LỊCH THI VÀ CHỨNG CHỈ ĐĂNG KÝ
          </h3>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-3 text-left">STT</th>
                <th className="border border-gray-400 p-3 text-left">Loại chứng chỉ</th>
                <th className="border border-gray-400 p-3 text-left">Cấp độ</th>
                <th className="border border-gray-400 p-3 text-left">Ngày thi</th>
                <th className="border border-gray-400 p-3 text-left">Giờ thi</th>
              </tr>
            </thead>
            <tbody>
              {registrationInfo.selectedSchedules.map((schedule, index) => (
                <tr key={schedule.id}>
                  <td className="border border-gray-400 p-3 text-center font-bold">{index + 1}</td>
                  <td className="border border-gray-400 p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        schedule.type === "english" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getCertificateTypeLabel(schedule.type)}
                    </span>
                  </td>
                  <td className="border border-gray-400 p-3 font-medium">{schedule.level}</td>
                  <td className="border border-gray-400 p-3">{new Date(schedule.date).toLocaleDateString("vi-VN")}</td>
                  <td className="border border-gray-400 p-3 font-bold text-blue-600">{schedule.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <strong>Tổng số lịch thi:</strong> {registrationInfo.selectedSchedules.length} lịch
            </p>
          </div>
        </div>

        {/* Payment Notice */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            THÔNG TIN THANH TOÁN
          </h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>
              • <strong>Phiếu đăng ký này chưa bao gồm thông tin thanh toán</strong>
            </p>
            <p>• Vui lòng chuyển phiếu này cho nhân viên kế toán để được lập hóa đơn và xử lý thanh toán</p>
            <p>
              • <strong>Thời hạn thanh toán:</strong> 3 ngày kể từ ngày lập phiếu
            </p>
            <p>• Phiếu đăng ký sẽ bị hủy nếu không thanh toán đúng hạn</p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">📋 LưU Ý QUAN TRỌNG</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Thí sinh phải mang theo CCCD/CMND gốc khi thi</p>
            <p>• Có mặt tại phòng thi trước giờ thi ít nhất 30 phút</p>
            <p>• Không được mang tài liệu, thiết bị điện tử vào phòng thi</p>
            <p>
              • Liên hệ hotline: <strong>(028) 1234 5678</strong> nếu có thắc mắc
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <p className="font-medium mb-16">Người đăng ký</p>
            <p className="text-sm text-gray-600">(Ký và ghi rõ họ tên)</p>
            <div className="border-t border-gray-400 mt-2 pt-1">
              <p className="font-bold">{registrationInfo.registrantName}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-medium mb-16">Nhân viên tiếp nhận</p>
            <p className="text-sm text-gray-600">(Ký và ghi rõ họ tên)</p>
            <div className="border-t border-gray-400 mt-2 pt-1">
              <p className="text-gray-500">_________________</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t border-gray-300">
          <p className="text-xs text-gray-500">
            Trung tâm ACCI - Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM - ĐT: (028) 1234 5678
          </p>
          <p className="text-xs text-gray-500">Email: info@acci.edu.vn - Website: www.acci.edu.vn</p>
        </div>
      </div>
    )
  },
)

PrintPreview.displayName = "PrintPreview"
