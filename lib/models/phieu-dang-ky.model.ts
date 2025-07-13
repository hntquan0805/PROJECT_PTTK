export interface PhieuDangKy {
  phieuDangKyId: string
  ngayDangKy: string
  daThanhToan: boolean
  soLuongThiSinh: number
  daDuyet: boolean
  daHuy: boolean
  thoiGianMongMuon?: string
  loaiChungChi: string
  ghiChu?: string
  nhanVienId?: string
  khachHangId?: string

  customerName?: string
  email?: string
  phone?: string
  loaiKhachHang?: string
  dueDate?: string
  status?: "pending_billing" | "billed" | "cancelled" | "approved" | "rejected"
}

export interface DisplayData {
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
  status: "pending_billing" | "billed" | "paid" | "overdue" | "sent" | "cancelled"
  createdDate: string
  loaiKhachHang?: string
  soLuongThiSinh?: number
  troGiaId?: string
}
