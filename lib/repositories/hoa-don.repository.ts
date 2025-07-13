// Data Access Layer - Updated HoaDon Repository
import { DatabaseConnection } from "../database/connection"
import type { HoaDon, CreateHoaDonRequest, HoaDonWithDetails } from "../models/thanh-toan.model"

export class HoaDonRepository {
  private db: DatabaseConnection

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async findPaidInvoices(): Promise<HoaDonWithDetails[]> {
    try {
      const result = await this.db.executeQuery(`
        SELECT 
          hd.hoaDonId,
          CONVERT(varchar, hd.ngayTao, 120) as ngayTao,
          CONVERT(varchar, hd.ngayThanhToan, 120) as ngayThanhToan,
          hd.hinhThucThanhToan,
          hd.thanhToanId,
          hd.trangThai,
          kh.hoTen as customerName,
          kh.email,
          tt.tongSoTien,
          tt.soTienBanDau,
          tt.soTienGiamGia,
          pdk.loaiChungChi
        FROM HoaDon hd
        INNER JOIN ThanhToan tt ON hd.thanhToanId = tt.thanhToanId
        LEFT JOIN PhieuDangKy pdk ON tt.phieuDangKyId = pdk.phieuDangKyId
        LEFT JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
        WHERE hd.trangThai = N'Đã thanh toán'
        ORDER BY hd.ngayThanhToan DESC, hd.ngayTao DESC
      `)
      return result.recordset
    } catch (error) {
      console.error("Error fetching paid invoices:", error)
      throw new Error("Failed to fetch paid invoices")
    }
  }

  async create(hoaDonData: CreateHoaDonRequest): Promise<number> {
    try {
      const ngayTao = hoaDonData.ngayTao || new Date().toISOString()
      const ngayThanhToan = hoaDonData.ngayThanhToan || null

      const result = await this.db.executeQuery(
        `
        INSERT INTO HoaDon (
          ngayTao, 
          ngayThanhToan, 
          hinhThucThanhToan, 
          thanhToanId, 
          trangThai
        ) 
        OUTPUT INSERTED.hoaDonId
        VALUES (
          @param0, @param1, @param2, @param3, @param4
        )
      `,
        [ngayTao, ngayThanhToan, hoaDonData.hinhThucThanhToan, hoaDonData.thanhToanId, hoaDonData.trangThai],
      )

      return result.recordset[0].hoaDonId
    } catch (error) {
      console.error("Error creating hoa don:", error)
      throw new Error("Failed to create hoa don")
    }
  }

  async updateStatus(hoaDonId: number, trangThai: string): Promise<void> {
    try {
      await this.db.executeQuery(
        `
        UPDATE HoaDon 
        SET trangThai = @param0
        WHERE hoaDonId = @param1
      `,
        [trangThai, hoaDonId],
      )
    } catch (error) {
      console.error("Error updating hoa don status:", error)
      throw new Error("Failed to update hoa don status")
    }
  }

  async updatePaymentDate(hoaDonId: number, ngayThanhToan: string): Promise<void> {
    try {
      await this.db.executeQuery(
        `
        UPDATE HoaDon 
        SET ngayThanhToan = @param0, trangThai = N'Đã thanh toán'
        WHERE hoaDonId = @param1
      `,
        [ngayThanhToan, hoaDonId],
      )
    } catch (error) {
      console.error("Error updating hoa don payment date:", error)
      throw new Error("Failed to update hoa don payment date")
    }
  }

  async findByThanhToanId(thanhToanId: string): Promise<HoaDon | null> {
    try {
      const result = await this.db.executeQuery(
        `
        SELECT 
          hoaDonId,
          CONVERT(varchar, ngayTao, 120) as ngayTao,
          CONVERT(varchar, ngayThanhToan, 120) as ngayThanhToan,
          hinhThucThanhToan,
          thanhToanId,
          trangThai
        FROM HoaDon 
        WHERE thanhToanId = @param0
      `,
        [thanhToanId],
      )

      return result.recordset.length > 0 ? result.recordset[0] : null
    } catch (error) {
      console.error("Error fetching hoa don by thanh toan ID:", error)
      throw new Error("Failed to fetch hoa don")
    }
  }
  
  async findById(hoaDonId: number): Promise<HoaDonWithDetails | null> {
    try {
      const result = await this.db.executeQuery(
        `
        SELECT 
          hd.hoaDonId,
          CONVERT(varchar, hd.ngayTao, 120) as ngayTao,
          CONVERT(varchar, hd.ngayThanhToan, 120) as ngayThanhToan,
          hd.hinhThucThanhToan,
          hd.thanhToanId,
          hd.trangThai,
          kh.hoTen as customerName,
          kh.email,
          tt.tongSoTien,
          tt.soTienBanDau,
          tt.soTienGiamGia,
          pdk.loaiChungChi
        FROM HoaDon hd
        INNER JOIN ThanhToan tt ON hd.thanhToanId = tt.thanhToanId
        LEFT JOIN PhieuDangKy pdk ON tt.phieuDangKyId = pdk.phieuDangKyId
        LEFT JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
        WHERE hd.hoaDonId = @param0
      `,
        [hoaDonId],
      )

      return result.recordset.length > 0 ? result.recordset[0] : null
    } catch (error) {
      console.error("Error fetching hoa don by ID:", error)
      throw new Error("Failed to fetch hoa don")
    }
  }
  
  async deleteHoaDon(hoaDonId: number): Promise<void> {
    try {
      // Tìm thông tin hóa đơn để lấy thanhToanId
      const hoaDon = await this.findById(hoaDonId)
      if (!hoaDon) {
        throw new Error("Không tìm thấy hóa đơn")
      }
      
      // Xóa hóa đơn
      await this.db.executeQuery(
        `DELETE FROM HoaDon WHERE hoaDonId = @param0`,
        [hoaDonId]
      )
      
      // Cập nhật trạng thái thanh toán về "Chưa lập hóa đơn"
      await this.db.executeQuery(
        `UPDATE ThanhToan SET trangThai = N'Chưa lập hóa đơn' WHERE thanhToanId = @param0`,
        [hoaDon.thanhToanId]
      )
    } catch (error) {
      console.error("Error deleting hoa don:", error)
      throw new Error("Failed to delete hoa don")
    }
  }
}
