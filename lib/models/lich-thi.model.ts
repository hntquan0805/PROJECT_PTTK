// Model cho bảng LichThi
export interface LichThi {
  lichThiId: string;
  thoiGianThi: string; // hoặc Date nếu muốn
  ngayThi: string;     // hoặc Date nếu muốn
  diaDiem: string;
  soThiSinhToiDa: number;
  soThiSinhDaDangKy: number;
  loaiKiemTraId: number;
} 

