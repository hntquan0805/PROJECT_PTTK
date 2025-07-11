"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { RegistrationStep } from "../types"
import type { RegistrationInfoForm, CreateRegistrationForm } from "../schemas"

export function useRegistration() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("input")
  const [savedRegistrationInfo, setSavedRegistrationInfo] = useState<RegistrationInfoForm | null>(null)
  const [registrationId, setRegistrationId] = useState<string>("")
  const [createdDate, setCreatedDate] = useState<Date>(new Date())

  const handleSaveRegistrationInfo = async (data: RegistrationInfoForm) => {
    const loadingToastId = toast.loading("Đang ghi nhận thông tin đăng ký...", {
      description: "Vui lòng chờ trong giây lát",
    })

    try {
      // Simulate API call with potential errors
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.8) {
            reject(new Error("Lỗi kết nối server"))
          } else {
            resolve(true)
          }
        }, 2000)
      })

      setSavedRegistrationInfo(data)
      setCurrentStep("create")

      toast.dismiss(loadingToastId)
      toast.success("Đã ghi nhận thông tin đăng ký thành công!", {
        description: `Đã lưu thông tin cho ${data.examineeName} với ${data.selectedSchedules.length} lịch thi`,
        duration: 4000,
        action: {
          label: "Tiếp tục",
          onClick: () => {
            document.getElementById("create-form")?.scrollIntoView({ behavior: "smooth" })
          },
        },
      })
    } catch (error) {
      toast.dismiss(loadingToastId)
      toast.error("Thông tin không hợp lệ! Vui lòng kiểm tra lại.", {
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu thông tin đăng ký",
        duration: 5000,
      })
    }
  }

  const handleCreateRegistrationForm = async (data: CreateRegistrationForm) => {
    const loadingToastId = toast.loading("Đang tạo phiếu đăng ký...", {
      description: "Đang xử lý và lưu vào hệ thống",
    })

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.9) {
            reject(new Error("Lỗi hệ thống"))
          } else {
            resolve(true)
          }
        }, 2500)
      })

      const newRegistrationId = `REG${Date.now()}`
      setRegistrationId(newRegistrationId)
      setCreatedDate(new Date())

      toast.dismiss(loadingToastId)
      toast.success("Đã lập phiếu đăng ký thành công!", {
        description: `Mã phiếu đăng ký: ${newRegistrationId}`,
        duration: 6000,
        action: {
          label: "Xem phiếu",
          onClick: () => {
            document.getElementById("print-section")?.scrollIntoView({ behavior: "smooth" })
          },
        },
      })

      setTimeout(() => {
        toast.info("Lưu ý quan trọng", {
          description: "Phiếu đăng ký cần được chuyển cho nhân viên kế toán để xử lý thanh toán",
          duration: 5000,
        })
      }, 1000)
    } catch (error) {
      toast.dismiss(loadingToastId)
      toast.error("Lập phiếu thất bại! Vui lòng kiểm tra lại thông tin.", {
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo phiếu đăng ký",
        duration: 5000,
      })
    }
  }

  const resetForm = () => {
    setCurrentStep("input")
    setSavedRegistrationInfo(null)
    setRegistrationId("")
    setCreatedDate(new Date())
    toast.info("Đã làm mới form đăng ký", {
      description: "Tất cả thông tin đã được xóa",
    })
  }

  return {
    currentStep,
    savedRegistrationInfo,
    registrationId,
    createdDate,
    setCurrentStep,
    handleSaveRegistrationInfo,
    handleCreateRegistrationForm,
    resetForm,
  }
}
