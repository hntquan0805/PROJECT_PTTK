"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, RefreshCw } from "lucide-react"
import type { CertificateDetailsData } from "@/lib/models/certificate.model"

type CertificateLookupProps = {
  onSearchSuccess: (data: CertificateDetailsData) => void
  onSearchError: (message: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function CertificateLookup({
  onSearchSuccess,
  onSearchError,
  isLoading,
  setIsLoading,
}: CertificateLookupProps) {
  const [activeTab, setActiveTab] = useState("certificate-code")
  const [certificateCode, setCertificateCode] = useState("")

  const handleSearch = async () => {
    if (!certificateCode) {
      onSearchError("Vui lòng nhập mã chứng chỉ.")
      return
    }

    setIsLoading(true)
    onSearchError("") // Clear previous errors

    try {
      const response = await fetch(`/api/certificate?maChungChi=${certificateCode}`)
      const data = await response.json()

      if (response.ok) {
        onSearchSuccess(data)
      } else {
        onSearchError(data.error || "Có lỗi xảy ra khi tra cứu.")
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error)
      onSearchError("Không thể kết nối đến máy chủ.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setCertificateCode("")
    onSearchError("") // Clear errors on refresh
    console.log("Form refreshed.")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Tra cứu chứng chỉ</h1>
        <p className="mt-2 text-lg text-gray-600">
          Tra cứu thông tin chứng chỉ bằng mã chứng chỉ hoặc thông tin thí sinh
        </p>
      </div>

      <Card className="mt-8 w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Search className="w-5 h-5" /> Thông tin tra cứu
          </CardTitle>
          <CardDescription>Chọn phương thức tra cứu và nhập thông tin cần thiết</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="certificate-code">Theo mã chứng chỉ</TabsTrigger>
              <TabsTrigger value="candidate-info">Theo thông tin thí sinh</TabsTrigger>
            </TabsList>
            <TabsContent value="certificate-code" className="mt-4 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="certificate-code"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mã chứng chỉ *
                </label>
                <Input
                  id="certificate-code"
                  placeholder="cc001"
                  value={certificateCode}
                  onChange={(e) => setCertificateCode(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-4">
                <Button className="flex-1" onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? (
                    "Đang tra cứu..."
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" /> Tra cứu
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Làm mới
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="candidate-info" className="mt-4 space-y-4">
              <p className="text-sm text-gray-500">Chức năng tra cứu theo thông tin thí sinh sẽ được phát triển sau.</p>
              <div className="flex gap-4">
                <Button className="flex-1" disabled>
                  <Search className="w-4 h-4 mr-2" /> Tra cứu
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Làm mới
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
