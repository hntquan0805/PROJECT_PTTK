// Repository xử lý truy vấn bảng KhachHang
import { DatabaseConnection } from '../database/connection';
import { KhachHang } from '../models/khach-hang.model';

export class KhachHangRepository {
  async getAll(): Promise<KhachHang[]> {
    const db = DatabaseConnection.getInstance();
    const result = await db.executeQuery('SELECT * FROM KhachHang');
    return result.recordset;
  }
  // Thêm các hàm truy vấn khác nếu cần
} 