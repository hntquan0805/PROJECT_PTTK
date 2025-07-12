// Repository xử lý truy vấn bảng LichThi
import { DatabaseConnection } from '../database/connection';
import { LichThi } from '../models/lich-thi.model';

export class LichThiRepository {
  async getAll(): Promise<LichThi[]> {
    const db = DatabaseConnection.getInstance();
    const result = await db.executeQuery('SELECT * FROM LichThi');
    return result.recordset;
  }
  // Thêm các hàm truy vấn khác nếu cần
} 