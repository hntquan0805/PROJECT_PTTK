// Presentation Layer - Updated React Component
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, X, Printer, FileText, User, Calendar, CreditCard, Mail, Phone, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
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
  const [selectedBill, setSelectedBill] = useState(null)
  const [viewBillModalOpen, setViewBillModalOpen] = useState(false)
  const [deletingBillId, setDeletingBillId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Thêm state cho việc sắp xếp
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch pending PhieuDangKy (chưa thanh toán)
      const phieuDangKyResponse = await fetch("/api/phieu-dang-ky")
      if (phieuDangKyResponse.ok) {
        const phieuDangKyData = await phieuDangKyResponse.json()
        setPhieuDangKys(Array.isArray(phieuDangKyData) ? phieuDangKyData : [])
      } else {
        throw new Error("Không thể tải dữ liệu phiếu đăng ký")
      }

      // Fetch paid invoices (Đã thanh toán)
      const historyResponse = await fetch("/api/hoa-don")
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setPaidInvoices(Array.isArray(historyData) ? historyData : [])
      } else {
        throw new Error("Không thể tải dữ liệu hóa đơn")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Không thể tải dữ liệu: " + (error.message || "Lỗi không xác định"))
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
    // Thực hiện gửi email
    alert(`Đã gửi email cho ${bill.customerName}!`)
  }

  const handleViewBill = async (hoaDonId) => {
    try {
      const response = await fetch(`/api/hoa-don?id=${hoaDonId}`)
      if (!response.ok) {
        throw new Error("Không thể tải thông tin hóa đơn")
      }
      const data = await response.json()
      setSelectedBill(data)
      setViewBillModalOpen(true)
    } catch (error) {
      console.error("Lỗi khi tải thông tin hóa đơn:", error)
      alert("Không thể tải thông tin hóa đơn. Vui lòng thử lại sau.")
    }
  }

  const handleDeleteBill = async (hoaDonId) => {
    if (confirm("Bạn có chắc chắn muốn xóa hóa đơn này không?")) {
      setDeletingBillId(hoaDonId)
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/hoa-don?id=${hoaDonId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error("Không thể xóa hóa đơn")
        }
        
        alert("Đã xóa hóa đơn thành công!")
        fetchData() // Tải lại dữ liệu
      } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error)
        alert("Không thể xóa hóa đơn. Vui lòng thử lại sau.")
      } finally {
        setDeletingBillId(null)
        setIsDeleting(false)
      }
    }
  }

  // Helper function to determine if customer is organization or individual
  const isOrganization = (phieuDangKy) => {
    // Kiểm tra xem phiếu đăng ký có phải của tổ chức không
    return phieuDangKy.soLuongThiSinh > 1
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

  // Hàm sắp xếp dữ liệu
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      // Xử lý các trường hợp đặc biệt
      if (key === 'hoaDonId' || key === 'phieuDangKyId') {
        // Loại bỏ tiền tố HD hoặc PDK nếu có
        const aValue = String(a[key]).replace(/^(HD|PDK)/, '');
        const bValue = String(b[key]).replace(/^(HD|PDK)/, '');
        return direction === 'ascending' 
          ? aValue.localeCompare(bValue, undefined, { numeric: true }) 
          : bValue.localeCompare(aValue, undefined, { numeric: true });
      }
      
      // Xử lý các trường ngày tháng
      if (key.includes('ngay') || key.includes('date') || key === 'ngayTao' || key === 'ngayThanhToan' || key === 'ngayDangKy' || key === 'hanThanhToan') {
        const aDate = a[key] ? new Date(a[key]) : new Date(0);
        const bDate = b[key] ? new Date(b[key]) : new Date(0);
        return direction === 'ascending' ? aDate - bDate : bDate - aDate;
      }
      
      // Xử lý các trường số tiền
      if (key === 'tongSoTien' || key === 'soTienBanDau' || key === 'price' || key === 'totalAmount') {
        const aValue = parseFloat(a[key]) || 0;
        const bValue = parseFloat(b[key]) || 0;
        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }
      
      // Xử lý các trường chuỗi thông thường
      if (a[key] === undefined || b[key] === undefined) {
        return 0;
      }
      
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return direction === 'ascending' 
          ? a[key].localeCompare(b[key]) 
          : b[key].localeCompare(a[key]);
      }
      
      // Mặc định
      return direction === 'ascending' 
        ? (a[key] > b[key] ? 1 : -1) 
        : (a[key] < b[key] ? 1 : -1);
    });
  };

  // Hàm xử lý khi click vào header để sắp xếp
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Áp dụng sắp xếp cho dữ liệu
  const sortedPhieuDangKys = sortConfig.key 
    ? sortData(filteredPhieuDangKys, sortConfig.key, sortConfig.direction) 
    : filteredPhieuDangKys;
    
  const sortedPaidInvoices = sortConfig.key 
    ? sortData(filteredPaidInvoices, sortConfig.key, sortConfig.direction) 
    : filteredPaidInvoices;

  // Tạo component header có thể sắp xếp
  const SortableHeader = ({ column, label }) => (
    <th 
      className="text-left p-3 font-medium cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortConfig.key === column ? (
          sortConfig.direction === 'ascending' ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-gray-400" />
        )}
      </div>
    </th>
  );

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

      {/* Modal xem chi tiết hóa đơn */}
      {viewBillModalOpen && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Chi tiết hóa đơn</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewBillModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              {/* Header */}
              <div className="bg-blue-600 text-white p-6 flex justify-between items-center rounded-lg mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">TRUNG TÂM ACCI</h1>
                    <p className="text-blue-100 text-sm">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                    <p className="text-blue-100 text-sm">Email: info@trungtam.edu.vn</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold">HÓA ĐƠN THANH TOÁN</h2>
                  <p className="text-blue-100">Số: HD{selectedBill.hoaDonId}</p>
                  <p className="text-blue-100">Ngày: {new Date(selectedBill.ngayTao).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
              
              {/* Thông tin khách hàng */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2 pl-1">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-700 text-base">Thông tin khách hàng</h3>
                </div>
                <div className="border-b border-blue-500 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                  {/* Cột trái */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-32 min-w-[110px] text-gray-600 text-sm">Mã thanh toán:</span>
                      <span className="font-medium">{selectedBill.thanhToanId}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 min-w-[110px] text-gray-600 text-sm">Tên khách hàng:</span>
                      <span className="font-medium">{selectedBill.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 min-w-[110px] text-gray-600 text-sm">Email:</span>
                      <span>{selectedBill.email}</span>
                    </div>
                  </div>
                  {/* Cột phải */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-32 min-w-[110px] text-gray-600 text-sm">Chứng chỉ:</span>
                      <span className="font-medium">{selectedBill.loaiChungChi || "IELTS"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 min-w-[110px] text-gray-600 text-sm">Ngày tạo:</span>
                      <span>{new Date(selectedBill.ngayTao).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 min-w-[110px] text-gray-600 text-sm">Ngày thanh toán:</span>
                      <span>{selectedBill.ngayThanhToan ? new Date(selectedBill.ngayThanhToan).toLocaleDateString("vi-VN") : "Chưa thanh toán"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chi tiết thanh toán */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2 pl-1">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold text-gray-700 text-base">Chi tiết thanh toán</h3>
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
                        <td className="border border-gray-300 px-4 py-2">Lệ phí thi chứng chỉ {selectedBill.loaiChungChi || "IELTS"}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{selectedBill.soTienBanDau?.toLocaleString()} đ</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{selectedBill.soTienBanDau?.toLocaleString()} đ</td>
                      </tr>
                      {selectedBill.soTienGiamGia > 0 && (
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Giảm giá</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">-{selectedBill.soTienGiamGia?.toLocaleString()} đ</td>
                          <td className="border border-gray-300 px-4 py-2 text-right font-semibold text-red-600">-{selectedBill.soTienGiamGia?.toLocaleString()} đ</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan="3" className="border border-gray-300 px-4 py-2 text-right font-semibold">Tổng cộng:</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-bold text-green-700">{selectedBill.tongSoTien?.toLocaleString()} đ</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-8">
                <div>
                  <Badge className={`${selectedBill.trangThai === "Đã thanh toán" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {selectedBill.trangThai}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setViewBillModalOpen(false)}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <SortableHeader column="phieuDangKyId" label="MÃ PHIẾU" />
                  <SortableHeader column="customerName" label="KHÁCH HÀNG" />
                  <SortableHeader column="certificate" label="CHỨNG CHỈ" />
                  <SortableHeader column="ngayDangKy" label="NGÀY ĐĂNG KÝ" />
                  <SortableHeader column="hanThanhToan" label="HẠN THANH TOÁN" />
                  <SortableHeader column="price" label="SỐ TIỀN" />
                  <th className="text-left p-3 font-medium">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {sortedPhieuDangKys.map((phieuDangKy) => {
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
                  <SortableHeader column="hoaDonId" label="MÃ HÓA ĐƠN" />
                  <SortableHeader column="thanhToanId" label="MÃ THANH TOÁN" />
                  <SortableHeader column="customerName" label="KHÁCH HÀNG" />
                  <SortableHeader column="ngayTao" label="NGÀY TẠO" />
                  <SortableHeader column="ngayThanhToan" label="NGÀY THANH TOÁN" />
                  <SortableHeader column="tongSoTien" label="TỔNG TIỀN" />
                  <SortableHeader column="trangThai" label="TRẠNG THÁI" />
                  <th className="text-left p-3 font-medium">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {sortedPaidInvoices.map((invoice) => (
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewBill(invoice.hoaDonId)}
                        >
                          Xem
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteBill(invoice.hoaDonId)}
                          disabled={isDeleting && deletingBillId === invoice.hoaDonId}
                        >
                          {isDeleting && deletingBillId === invoice.hoaDonId ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2"></div>
                              Xóa...
                            </>
                          ) : "Xóa"}
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
