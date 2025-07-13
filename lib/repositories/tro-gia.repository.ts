// Data Access Layer - TroGia Repository
import { DatabaseConnection } from "../database/connection"
import type { TroGia } from "../models/tro-gia.model"

export class TroGiaRepository {
  private db: DatabaseConnection

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async findAll(): Promise<TroGia[]> {
    try {
      const result = await this.db.executeQuery(`
        SELECT 
          troGiaId,
          tiLeGiamGia,
          moTaChinhSach,
          soThiSinhToiThieu,
          truongHopMienPhiGiaHan,
          doiTuong,
          ngayBatDau,
          ngayKetThuc
        FROM TroGia
      `)
      return result.recordset
    } catch (error) {
      console.error("Error fetching TroGia:", error)
      throw new Error("Failed to fetch TroGia options")
    }
  }
}
