export interface HoaDon {
  hoaDonId: number
  ngayTao: string
  ngayThanhToan?: string
  hinhThucThanhToan?: string
  thanhToanId: string
  trangThai: string
}

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