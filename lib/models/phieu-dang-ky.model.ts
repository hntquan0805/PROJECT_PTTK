// Model for PhieuDangKy
export interface PhieuDangKy {
  phieuDangKyId: string;
  ngayDangKy: Date | string;
  daThanhToan: boolean;
  soLuongThiSinh: number;
  daDuyet: boolean;
  daHuy: boolean;
  thoiGianMongMuon: Date | string;
  ghiChu: string;
  loaiChungChi: string;
  
  // Mapped fields from joins
  customerName: string; // from KhachHang.hoTen
  email: string; // from KhachHang.email
  phone: string; // from KhachHang.soDienThoai
  customerType: string; // from KhachHang.loaiKhachHang
  certificate: string; // from LoaiKiemTra.tenKiemTra
  price: number; // from LoaiKiemTra.giaHienTai
} 