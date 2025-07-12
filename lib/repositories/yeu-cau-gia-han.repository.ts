// Repository xử lý truy vấn bảng YeuCauGiaHan
import { DatabaseConnection } from '../database/connection';
import { YeuCauGiaHan } from '../models/yeu-cau-gia-han.model';

export class YeuCauGiaHanRepository {
  async getAll(): Promise<YeuCauGiaHan[]> {
    const db = DatabaseConnection.getInstance();
    const result = await db.executeQuery(`SELECT
      ych.*,
      pdt.soLanGiaHan,
      ts.hoTen AS tenThiSinh,
      kh.loaiKhachHang,
      kh.soDienThoai,
      kh.email,
      lt.ngayThi as ngaythicu,
      lkt.tenKiemTra
    FROM YeuCauGiaHan ych
    JOIN PhieuDuThi pdt ON ych.phieuDuThiId = pdt.phieuDuThiId
    JOIN ChiTietDangKy ctdk ON pdt.chiTietDangKyId = ctdk.chiTietDangKyId
    JOIN ThiSinh ts ON ctdk.thiSinhId = ts.thiSinhId
    JOIN KhachHang kh ON ts.khachHangId = kh.khachHangId
    JOIN LichThi lt ON lt.lichThiId = ctdk.lichThiId
    JOIN LoaiKiemTra lkt ON lt.loaiKiemTraId = lkt.loaiKiemTraId`);

    if (!result.recordset || result.recordset.length === 0) return [];

    // Map từng row thành object đúng định dạng trả về
    return result.recordset.map(row => ({
      id: row.yeuCauGiaHanId ,
      ticketId: row.phieuDuThiId ,
      customerName: row.tenThiSinh ,
      customerType: row.loaiKhachHang ,
      phone: row.soDienThoai ,
      email: row.email ,
      examType: row.tenKiemTra  ,
      currentDate:row.ngaythicu,
      requestedDate: row.ngaythimongmuon ,
      reason: row.lyDo ,
      extensionCount:  row.soLanGiaHan ,
      status: row.trangThai,
      requestDate: row.ngayYeuCau,
      documents: row.bangchung , 
      lyDoTuChoi:row.lydotuchoi,
      specialCase: "",// tạm thời cho null 

    }));
  }
  async updateStatusById(id: string, status: string, lyDoTuChoi?: string): Promise<boolean> {
    const db = DatabaseConnection.getInstance();
    let query = `UPDATE YeuCauGiaHan SET trangThai = @param1`;
    const params = [id, status];
    if (lyDoTuChoi !== undefined) {
      query += `, lyDoTuChoi = @param2`;
      params.push(lyDoTuChoi);
    }
    query += ` WHERE yeuCauGiaHanId = @param0`;
    const result = await db.executeQuery(query, params);
    return result.rowsAffected && result.rowsAffected[0] > 0;
  }
  // Thêm các hàm create, update, duyệt, từ chối ...
}

// Repository lấy dữ liệu bảng TroGia
export interface TroGia {
  troGiaId: string;
  tiLeGiamGia: number;
  moTaChinhSach: string;
  soThiSinhToiThieu: number;
  truongHopMienPhiGiaHan: string;
  doiTuong: string;
  ngayBatDau: string;
  ngayKetThuc: string;
}

export class TroGiaRepository {
  async getAll(): Promise<TroGia[]> {
    const db = DatabaseConnection.getInstance();
    const result = await db.executeQuery('SELECT * FROM TroGia');
    return result.recordset;
  }
}
