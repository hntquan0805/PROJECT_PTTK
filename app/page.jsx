// Presentation Layer - Updated React Component
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import BillForm from "./components/bill-form"
import SuccessScreen from "./components/success-screen"

export default function BillManagement() {
  const [currentScreen, setCurrentScreen] = useState("list")
  const [thanhToans, setThanhToans] = useState([])
  const [paidInvoices, setPaidInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedThanhToan, setSelectedThanhToan] = useState(null)
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch pending ThanhToan (Chưa lập hóa đơn)
      const thanhToanResponse = await fetch("/api/thanh-toan")
      if (thanhToanResponse.ok) {
        const thanhToanData = await thanhToanResponse.json()
        setThanhToans(Array.isArray(thanhToanData) ? thanhToanData : [])
      }

      // Fetch paid invoices (Đã thanh toán)
      const historyResponse = await fetch("/api/hoa-don")
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setPaidInvoices(Array.isArray(historyData) ? historyData : [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Không thể tải dữ liệu")
      setThanhToans([])
      setPaidInvoices([])
    } finally {
      setLoading(false)
    }
  }

  const handleEditBill = (thanhToan) => {
    const billDisplayData = {
      id: thanhToan.thanhToanId,
      customerName: thanhToan.customerName || "",
      email: thanhToan.email || "",
      phone: thanhToan.phone || "",
      certificate: thanhToan.certificate || "Chứng chỉ",
      registrationDate: thanhToan.registrationDate || "",
      dueDate: thanhToan.dueDate,
      paymentDeadline: thanhToan.hanThanhToan,
      originalAmount: thanhToan.soTienBanDau,
      discount: (thanhToan.soTienGiamGia / thanhToan.soTienBanDau) * 100 || 0,
      totalAmount: thanhToan.tongSoTien,
      paymentMethod: thanhToan.loaiThanhToan,
      paymentDate: "",
      notes: "",
      status: thanhToan.status || "pending",
      createdDate: thanhToan.createdDate || "",
    }
    setCurrentScreen("form")
    setSelectedThanhToan(billDisplayData)
  }

  const handleSendEmail = async (bill) => {
    setSelectedThanhToan(bill)
    setCurrentScreen("success")
  }

  // Helper function to determine if customer is organization or individual
  const isOrganization = (thanhToan) => {
    const orgKeywords = ["trường", "công ty", "tnhh", "cổ phần", "tập đoàn", "viện", "trung tâm"]
    return orgKeywords.some((keyword) => (thanhToan.customerName || "").toLowerCase().includes(keyword))
  }

  const isOrganizationInvoice = (invoice) => {
    const orgKeywords = ["trường", "công ty", "tnhh", "cổ phần", "tập đoàn", "viện", "trung tâm"]
    return orgKeywords.some((keyword) => (invoice.customerName || "").toLowerCase().includes(keyword))
  }

  // Filter thanh toan by ID search and customer type
  const filteredThanhToans = thanhToans.filter((thanhToan) => {
    const matchesSearch = searchTerm === "" || thanhToan.thanhToanId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCustomerType =
      customerTypeFilter === "all" ||
      (customerTypeFilter === "organization" && isOrganization(thanhToan)) ||
      (customerTypeFilter === "individual" && !isOrganization(thanhToan))
    return matchesSearch && matchesCustomerType
  })

  // Filter paid invoices by search and customer type
  const filteredPaidInvoices = paidInvoices.filter((invoice) => {
    const matchesSearch = searchTerm === "" || invoice.thanhToanId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCustomerType =
      customerTypeFilter === "all" ||
      (customerTypeFilter === "organization" && isOrganizationInvoice(invoice)) ||
      (customerTypeFilter === "individual" && !isOrganizationInvoice(invoice))
    return matchesSearch && matchesCustomerType
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchData}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "form") {
    return (
      <BillForm
        bill={selectedThanhToan}
        onCancel={() => setCurrentScreen("list")}
        onSubmit={(billData) => {
          setSelectedThanhToan(billData)
          setCurrentScreen("success")
        }}
        onSendEmail={handleSendEmail}
        loading={loading}
      />
    )
  }

  if (currentScreen === "success") {
    return (
      <SuccessScreen
        bill={selectedThanhToan}
        onComplete={() => {
          setCurrentScreen("list")
          fetchData()
        }}
        onResendEmail={() => handleSendEmail(selectedThanhToan)}
      />
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Quản lý hóa đơn</h1>
        <p className="text-gray-600">Quản lý và xử lý hóa đơn thanh toán cho khách hàng</p>
      </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="flex w-full justify-between mb-4">
            <TabsTrigger value="pending">Chờ thanh toán ({filteredThanhToans.length})</TabsTrigger>
            <TabsTrigger value="history">Lịch sử thanh toán ({filteredPaidInvoices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo mã thanh toán..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant={customerTypeFilter === "all" ? "default" : "outline"}
                onClick={() => setCustomerTypeFilter("all")}
              >
                Tất cả ({thanhToans.length})
              </Button>
              <Button
                variant={customerTypeFilter === "organization" ? "default" : "outline"}
                onClick={() => setCustomerTypeFilter("organization")}
              >
                Đơn vị ({thanhToans.filter((tt) => isOrganization(tt)).length})
              </Button>
              <Button
                variant={customerTypeFilter === "individual" ? "default" : "outline"}
                onClick={() => setCustomerTypeFilter("individual")}
              >
                Cá nhân ({thanhToans.filter((tt) => !isOrganization(tt)).length})
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">MÃ THANH TOÁN</th>
                    <th className="text-left p-3 font-medium">KHÁCH HÀNG</th>
                    <th className="text-left p-3 font-medium">CHỨNG CHỈ</th>
                    <th className="text-left p-3 font-medium">NGÀY ĐĂNG KÝ</th>
                    <th className="text-left p-3 font-medium">HẠN THANH TOÁN</th>
                    <th className="text-left p-3 font-medium">SỐ TIỀN</th>
                    <th className="text-left p-3 font-medium">TRẠNG THÁI</th>
                    <th className="text-left p-3 font-medium">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredThanhToans.map((thanhToan) => (
                    <tr key={thanhToan.thanhToanId} className="border-b hover:bg-gray-50">
                      <td className="p-3">{thanhToan.thanhToanId}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{thanhToan.customerName}</div>
                          <div className="text-sm text-gray-500">{thanhToan.email}</div>
                          <Badge variant="outline" className="text-xs">
                            {isOrganization(thanhToan) ? "Đơn vị" : "Cá nhân"}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">{thanhToan.certificate}</td>
                      <td className="p-3">{thanhToan.registrationDate}</td>
                      <td className="p-3">
                        <span className={thanhToan.status === "overdue" ? "text-red-600" : ""}>
                          {new Date(thanhToan.hanThanhToan).toLocaleDateString("vi-VN")}
                        </span>
                      </td>
                      <td className="p-3">
                        <div>
                          <div>{thanhToan.tongSoTien.toLocaleString()} đ</div>
                          {thanhToan.soTienGiamGia > 0 && (
                            <div className="text-sm text-gray-500">{thanhToan.soTienBanDau.toLocaleString()} đ</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={thanhToan.status === "overdue" ? "text-red-600" : ""}>
                          {thanhToan.trangThai}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          onClick={() => handleEditBill(thanhToan)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Lập hóa đơn
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">MÃ HÓA ĐƠN</th>
                    <th className="text-left p-3 font-medium">MÃ THANH TOÁN</th>
                    <th className="text-left p-3 font-medium">KHÁCH HÀNG</th>
                    <th className="text-left p-3 font-medium">NGÀY TẠO</th>
                    <th className="text-left p-3 font-medium">NGÀY THANH TOÁN</th>
                    <th className="text-left p-3 font-medium">TỔNG TIỀN</th>
                    <th className="text-left p-3 font-medium">TRẠNG THÁI</th>
                    <th className="text-left p-3 font-medium">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaidInvoices.map((invoice) => (
                    <tr key={invoice.hoaDonId} className="border-b hover:bg-gray-50">
                      <td className="p-3">HD{invoice.hoaDonId}</td>
                      <td className="p-3">{invoice.thanhToanId}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{invoice.customerName}</div>
                          <Badge variant="outline" className="text-xs">
                            {isOrganizationInvoice(invoice) ? "Đơn vị" : "Cá nhân"}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">{new Date(invoice.ngayTao).toLocaleDateString("vi-VN")}</td>
                      <td className="p-3">
                        {invoice.ngayThanhToan ? new Date(invoice.ngayThanhToan).toLocaleDateString("vi-VN") : "-"}
                      </td>
                      <td className="p-3">{invoice.tongSoTien.toLocaleString()} đ</td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-800">{invoice.trangThai}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Xem
                          </Button>
                          <Button size="sm" variant="outline">
                            In
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  )
}
