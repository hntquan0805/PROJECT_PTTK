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

  customerName?: string
  email?: string
  phone?: string
  certificate?: string
  registrationDate?: string
  dueDate: string
  status?: "pending" | "paid" | "overdue" | "invoice_created"
  createdDate?: string
  loaiKhachHang?: string
}

export interface CreatePhieuTTRequest {
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
}