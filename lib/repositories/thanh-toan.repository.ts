// Data Access Layer - Updated ThanhToan Repository
import { DatabaseConnection } from "../database/connection"
import type { ThanhToan, CreatePhieuTTRequest } from "../models/phieu-thanh-toan.model"

export class ThanhToanRepository {
  private db: DatabaseConnection

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async updateStatus(thanhToanId: string, trangThai: string): Promise<void> {
    try {
      await this.db.executeQuery(
        `
        UPDATE ThanhToan 
        SET trangThai = @param0
        WHERE thanhToanId = @param1
      `,
        [trangThai, thanhToanId],
      )
    } catch (error) {
      console.error("Error updating thanh toan status:", error)
      throw new Error("Failed to update thanh toan status")
    }
  }

  async create(thanhToan: CreatePhieuTTRequest): Promise<string> {
    try {
      const thanhToanId = `TT${Date.now()}`
      const troGiaId = thanhToan.troGiaId || null
      const phieuGiaHanId = thanhToan.phieuGiaHanId || null
      const soTienGiamGia = thanhToan.soTienBanDau * thanhToan.soTienGiamGia /100

      await this.db.executeQuery(
        `
        INSERT INTO ThanhToan (
          thanhToanId, soTienBanDau, hanThanhToan, soTienGiamGia, tongSoTien,
          loaiThanhToan, trangThai, troGiaId, nhanVienId, phieuDangKyId, phieuGiaHanId
        ) VALUES (
          @param0, @param1, @param2, @param3, @param4,
          @param5, @param6, @param7, @param8, @param9, @param10
        )
      `,
        [
          thanhToanId,
          thanhToan.soTienBanDau,
          thanhToan.hanThanhToan,
          soTienGiamGia,
          thanhToan.tongSoTien,
          thanhToan.loaiThanhToan,
          thanhToan.trangThai,
          troGiaId,
          thanhToan.nhanVienId,
          thanhToan.phieuDangKyId,
          phieuGiaHanId,
        ],
      )

      return thanhToanId
    } catch (error) {
      console.error("Error creating thanh toan:", error)
      throw new Error("Failed to create thanh toan")
    }
  }

  async findByPhieuDKId(phieuTTId: string): Promise<ThanhToan | null> {
    try {
      const result = await this.db.executeQuery(
        `
        SELECT 
          thanhToanId
        FROM ThanhToan 
        WHERE thanhToanId = @param0
      `,
        [phieuTTId],
      )

      return result.recordset.length > 0 ? result.recordset[0] : null
    } catch (error) {
      console.error("Error fetching phieu thanh toan by phieu dang ky ID:", error)
      throw new Error("Failed to fetch hoa don")
    }
  }
}
