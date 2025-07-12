// Presentation Layer - Updated React Component
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import BillForm from "./components/bill-form"
import IndividualBillForm from "./components/individual-bill-form"
import SuccessScreen from "./components/success-screen"

export default function BillManagement() {
  const [currentScreen, setCurrentScreen] = useState("list")
  const [phieuDangKys, setPhieuDangKys] = useState([])
  const [paidInvoices, setPaidInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPhieuDangKy, setSelectedPhieuDangKy] = useState(null)
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all")
  const [formType, setFormType] = useState("organization") // "organization" hoặc "individual"

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch pending PhieuDangKy (chưa thanh toán)
      const phieuDangKyResponse = await fetch("/api/thanh-toan")
      if (phieuDangKyResponse.ok) {
        const phieuDangKyData = await phieuDangKyResponse.json()
        setPhieuDangKys(Array.isArray(phieuDangKyData) ? phieuDangKyData : [])
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
      setPhieuDangKys([])
      setPaidInvoices([])
    } finally {
      setLoading(false)
    }
  }

  const handleEditBill = (phieuDangKy) => {
    // Tính hạn thanh toán = ngày đăng ký + 3 ngày
    const registrationDate = phieuDangKy.ngayDangKy ? new Date(phieuDangKy.ngayDangKy) : new Date();
    const paymentDeadlineDate = new Date(registrationDate);
    paymentDeadlineDate.setDate(paymentDeadlineDate.getDate() + 3);
    
    const billDisplayData = {
      id: phieuDangKy.phieuDangKyId,
      customerName: phieuDangKy.customerName || "",
      email: phieuDangKy.email || "",
      phone: phieuDangKy.phone || "",
      certificate: phieuDangKy.certificate || phieuDangKy.loaiChungChi || "Chứng chỉ",
      registrationDate: phieuDangKy.ngayDangKy ? new Date(phieuDangKy.ngayDangKy).toLocaleDateString("vi-VN") : "",
      dueDate: phieuDangKy.thoiGianMongMuon ? new Date(phieuDangKy.thoiGianMongMuon).toLocaleDateString("vi-VN") : "",
      paymentDeadline: paymentDeadlineDate.toLocaleDateString("vi-VN"),
      originalAmount: phieuDangKy.price * phieuDangKy.soLuongThiSinh || 0,
      discount: 0,
      totalAmount: phieuDangKy.price * phieuDangKy.soLuongThiSinh || 0,
      paymentMethod: "Chuyển khoản",
      paymentDate: "",
      notes: phieuDangKy.ghiChu || "",
      status: "pending",
    }
    setSelectedPhieuDangKy(billDisplayData)
    
    // Xác định loại form dựa trên loại khách hàng
    const isOrg = isOrganization(phieuDangKy)
    setFormType(isOrg ? "organization" : "individual")
    setCurrentScreen("form")
  }

  const handleSendEmail = async (bill) => {
    setSelectedPhieuDangKy(bill)
    setCurrentScreen("success")
  }

  // Helper function to determine if customer is organization or individual
  const isOrganization = (phieuDangKy) => {
    if (phieuDangKy.customerType) {
      return phieuDangKy.customerType === "Đơn vị"
    }
    
    const orgKeywords = ["trường", "công ty", "tnhh", "cổ phần", "tập đoàn", "viện", "trung tâm"]
    return orgKeywords.some((keyword) => (phieuDangKy.customerName || "").toLowerCase().includes(keyword))
  }

  const isOrganizationInvoice = (invoice) => {
    const orgKeywords = ["trường", "công ty", "tnhh", "cổ phần", "tập đoàn", "viện", "trung tâm"]
    return orgKeywords.some((keyword) => (invoice.customerName || "").toLowerCase().includes(keyword))
  }

  // Filter phieuDangKy by ID search and customer type
  const filteredPhieuDangKys = phieuDangKys.filter((phieuDangKy) => {
    const matchesSearch = searchTerm === "" || phieuDangKy.phieuDangKyId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCustomerType =
      customerTypeFilter === "all" ||
      (customerTypeFilter === "organization" && isOrganization(phieuDangKy)) ||
      (customerTypeFilter === "individual" && !isOrganization(phieuDangKy))
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
    if (formType === "organization") {
      return (
        <BillForm
          bill={selectedPhieuDangKy}
          onCancel={() => setCurrentScreen("list")}
          onSubmit={(billData) => {
            setSelectedPhieuDangKy(billData)
            setCurrentScreen("success")
          }}
          onSendEmail={handleSendEmail}
          loading={loading}
        />
      )
    } else {
      return (
        <IndividualBillForm
          bill={selectedPhieuDangKy}
          onCancel={() => setCurrentScreen("list")}
          onSubmit={(billData) => {
            setSelectedPhieuDangKy(billData)
            setCurrentScreen("success")
          }}
          loading={loading}
        />
      )
    }
  }

  if (currentScreen === "success") {
    return (
      <SuccessScreen
        bill={selectedPhieuDangKy}
        onComplete={() => {
          setCurrentScreen("list")
          fetchData()
        }}
        onResendEmail={() => handleSendEmail(selectedPhieuDangKy)}
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
            <TabsTrigger value="pending">Chờ thanh toán ({filteredPhieuDangKys.length})</TabsTrigger>
            <TabsTrigger value="history">Lịch sử thanh toán ({filteredPaidInvoices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo mã phiếu đăng ký..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant={customerTypeFilter === "all" ? "default" : "outline"}
                onClick={() => setCustomerTypeFilter("all")}
              >
                Tất cả ({phieuDangKys.length})
              </Button>
              <Button
                variant={customerTypeFilter === "organization" ? "default" : "outline"}
                onClick={() => setCustomerTypeFilter("organization")}
              >
                Đơn vị ({phieuDangKys.filter((pdk) => isOrganization(pdk)).length})
              </Button>
              <Button
                variant={customerTypeFilter === "individual" ? "default" : "outline"}
                onClick={() => setCustomerTypeFilter("individual")}
              >
                Cá nhân ({phieuDangKys.filter((pdk) => !isOrganization(pdk)).length})
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">MÃ PHIẾU</th>
                    <th className="text-left p-3 font-medium">KHÁCH HÀNG</th>
                    <th className="text-left p-3 font-medium">CHỨNG CHỈ</th>
                    <th className="text-left p-3 font-medium">NGÀY ĐĂNG KÝ</th>
                    <th className="text-left p-3 font-medium">HẠN THANH TOÁN</th>
                    <th className="text-left p-3 font-medium">SỐ TIỀN</th>
                    <th className="text-left p-3 font-medium">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhieuDangKys.map((phieuDangKy) => {
                    // Tính hạn thanh toán cho mỗi phiếu = ngày đăng ký + 3 ngày
                    const registrationDate = phieuDangKy.ngayDangKy ? new Date(phieuDangKy.ngayDangKy) : new Date();
                    const paymentDeadlineDate = new Date(registrationDate);
                    paymentDeadlineDate.setDate(paymentDeadlineDate.getDate() + 3);
                    
                    // Tính số tiền = giá * số thí sinh
                    const totalAmount = (phieuDangKy.price || 0) * (phieuDangKy.soLuongThiSinh || 0);
                    
                    return (
                    <tr key={phieuDangKy.phieuDangKyId} className="border-b hover:bg-gray-50">
                      <td className="p-3">{phieuDangKy.phieuDangKyId}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{phieuDangKy.customerName}</div>
                          <div className="text-sm text-gray-500">{phieuDangKy.email}</div>
                          <Badge variant="outline" className="text-xs">
                            {isOrganization(phieuDangKy) ? "Đơn vị" : "Cá nhân"}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">{phieuDangKy.certificate || phieuDangKy.loaiChungChi}</td>
                      <td className="p-3">{phieuDangKy.ngayDangKy ? new Date(phieuDangKy.ngayDangKy).toLocaleDateString("vi-VN") : ""}</td>
                      <td className="p-3">
                        <span className="text-red-600">
                          {paymentDeadlineDate.toLocaleDateString("vi-VN")}
                        </span>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{totalAmount.toLocaleString()} đ</div>
                          <div className="text-xs text-gray-500">
                            {phieuDangKy.soLuongThiSinh} thí sinh x {phieuDangKy.price?.toLocaleString() || 0} đ
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          onClick={() => handleEditBill(phieuDangKy)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Lập hóa đơn
                        </Button>
                      </td>
                    </tr>
                  )})}
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
