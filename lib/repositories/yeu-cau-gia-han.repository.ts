// Repository xử lý truy vấn bảng YeuCauGiaHan
import { DatabaseConnection } from '../database/connection';
import { YeuCauGiaHan } from '../models/yeu-cau-gia-han.model';

export class YeuCauGiaHanRepository {
  async getAll(): Promise<YeuCauGiaHan[]> {
    const db = DatabaseConnection.getInstance();
    const result = await db.executeQuery('SELECT * FROM YeuCauGiaHan');
    return result.recordset;
  }
  // Thêm các hàm create, update, duyệt, từ chối ...
} 