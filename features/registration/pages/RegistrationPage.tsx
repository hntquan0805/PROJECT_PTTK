"use client"

import { ProgressSteps } from "../components/ProgressSteps"
import { RegistrationInfoForm } from "../components/RegistrationInfoForm"
import { CreateRegistrationForm } from "../components/CreateRegistrationForm"
import { RegistrationSummary } from "../components/RegistrationSummary"
import { useRegistration } from "../hooks/useRegistration"

export function RegistrationPage() {
  const {
    currentStep,
    savedRegistrationInfo,
    registrationId,
    createdDate,
    setCurrentStep,
    handleSaveRegistrationInfo,
    handleCreateRegistrationForm,
    resetForm,
  } = useRegistration()

  const showPrintSection = Boolean(registrationId && savedRegistrationInfo)

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentStep === "input" ? "Ghi Nhận Thông Tin Đăng Ký" : "Lập Phiếu Đăng Ký"}
          </h1>
          <p className="text-gray-600">Trung tâm tổ chức thi chứng chỉ anh ngữ và tin học ACCI</p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={currentStep} />

        {currentStep === "input" ? (
          /* BƯỚC 1: GHI NHẬN THÔNG TIN ĐĂNG KÝ */
          <RegistrationInfoForm onSubmit={handleSaveRegistrationInfo} onReset={resetForm} />
        ) : (
          /* BƯỚC 2: LẬP PHIẾU ĐĂNG KÝ */
          <div id="create-form" className="space-y-6">
            {savedRegistrationInfo && <RegistrationSummary registrationInfo={savedRegistrationInfo} />}
            <CreateRegistrationForm
              onSubmit={handleCreateRegistrationForm}
              onBack={() => setCurrentStep("input")}
              registrationInfo={savedRegistrationInfo!}
              registrationId={registrationId}
              createdDate={createdDate}
              showPrintSection={showPrintSection}
            />
          </div>
        )}

        {/* Footer info */}
        <div className="text-center text-sm text-gray-500 mt-8 p-4 bg-white rounded-lg border">
          {currentStep === "input" ? (
            <div className="space-y-1">
              <p className="font-medium">📝 Hướng dẫn:</p>
              <p>Vui lòng nhập đầy đủ thông tin và chọn lịch thi trước khi lưu.</p>
              <p>Các trường có dấu (*) là bắt buộc.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-medium">⏰ Lưu ý quan trọng:</p>
              <p>Sau khi tạo phiếu đăng ký thành công, khách hàng có thể tiến hành thanh toán trong vòng 3 ngày.</p>
              <p>Phiếu đăng ký chưa thanh toán sẽ bị hủy sau thời hạn trên.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
