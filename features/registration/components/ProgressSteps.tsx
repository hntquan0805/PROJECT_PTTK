import { CheckCircle } from "lucide-react"
import type { RegistrationStep } from "../types"

interface ProgressStepsProps {
  currentStep: RegistrationStep
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div
        className={`flex items-center space-x-2 transition-colors duration-300 ${
          currentStep === "input" ? "text-blue-600" : "text-green-600"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            currentStep === "input" ? "bg-blue-600 text-white shadow-lg" : "bg-green-600 text-white shadow-lg"
          }`}
        >
          {currentStep === "create" ? <CheckCircle className="w-6 h-6" /> : "1"}
        </div>
        <span className="font-medium">Ghi nhận thông tin</span>
      </div>
      <div
        className={`w-20 h-2 rounded-full transition-colors duration-500 ${
          currentStep === "create" ? "bg-green-600" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`flex items-center space-x-2 transition-colors duration-300 ${
          currentStep === "create" ? "text-blue-600" : "text-gray-400"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            currentStep === "create" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-300 text-gray-600"
          }`}
        >
          2
        </div>
        <span className="font-medium">Lập phiếu đăng ký</span>
      </div>
    </div>
  )
}
