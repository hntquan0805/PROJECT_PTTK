// Data Access Layer - Updated Models with complete HoaDon structure
export interface ThanhToan {
  thanhToanId: string
  soTienBanDau: number
  hanThanhToan: string
  soTienGiamGia: number
  tongSoTien: number
  loaiThanhToan: string
  trangThai: string
  troGiaId?: string
  nhanVienId?: string
  phieuDangKyId?: string
  phieuGiaHanId?: string
  // Additional fields for display
  customerName?: string
  email?: string
  phone?: string
  certificate?: string
  registrationDate?: string
  dueDate: string
  status?: "pending" | "paid" | "overdue" | "invoice_created"
  createdDate?: string
}

export interface HoaDon {
  hoaDonId: number
  ngayTao: string
  ngayThanhToan?: string
  hinhThucThanhToan?: string
  thanhToanId: string
  trangThai: string
}

export interface CreateHoaDonRequest {
  ngayTao?: string
  ngayThanhToan?: string
  hinhThucThanhToan: string
  thanhToanId: string
  trangThai: string
}

// Interface for HoaDon with ThanhToan details for history tab
export interface HoaDonWithDetails {
  hoaDonId: number
  ngayTao: string
  ngayThanhToan?: string
  hinhThucThanhToan?: string
  thanhToanId: string
  trangThai: string
  customerName?: string
  email?: string
  tongSoTien: number
  soTienBanDau: number
  soTienGiamGia: number
}

export interface BillDisplayData {
  id: string
  customerName: string
  email: string
  phone: string
  certificate: string
  registrationDate: string
  dueDate: string
  paymentDeadline: string
  originalAmount: number
  discount: number
  totalAmount: number
  paymentMethod: string
  paymentDate?: string
  notes: string
  status: "pending" | "paid" | "overdue" | "bill_generated" | "sent" | "cancelled" | "invoice_created"
  createdDate: string
}
