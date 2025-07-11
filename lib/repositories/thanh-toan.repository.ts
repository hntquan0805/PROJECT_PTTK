// Data Access Layer - Updated ThanhToan Repository
import { DatabaseConnection } from "../database/connection"
import type { ThanhToan } from "../models/thanh-toan.model"

export class ThanhToanRepository {
  private db: DatabaseConnection

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async findByStatus(trangThai: string): Promise<ThanhToan[]> {
    try {
      const result = await this.db.executeQuery(
        `
        SELECT 
          tt.thanhToanId,
          tt.soTienBanDau,
          CONVERT(varchar, tt.hanThanhToan, 120) as hanThanhToan,
          tt.soTienGiamGia,
          tt.tongSoTien,
          tt.loaiThanhToan,
          tt.trangThai,
          tt.troGiaId,
          tt.nhanVienId,
          tt.phieuDangKyId,
          tt.phieuGiaHanId,
          kh.hoTen as customerName,
          kh.email,
          kh.soDienThoai as phone,
          pdk.loaiChungChi as certificate,
          CONVERT(varchar, pdk.ngayDangKy, 120) as registrationDate,
          nt.dueDate,
          CASE 
            WHEN tt.hanThanhToan < GETDATE() AND tt.trangThai = N'Chưa lập hóa đơn' THEN 'overdue'
            WHEN tt.trangThai = N'Đã lập hóa đơn' THEN 'invoice_created'
            ELSE 'pending'
          END as status,
          CONVERT(varchar, pdk.ngayDangKy, 120) as createdDate
        FROM ThanhToan tt
        LEFT JOIN PhieuDangKy pdk ON tt.phieuDangKyId = pdk.phieuDangKyId
        LEFT JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
        LEFT JOIN (
          SELECT 
            ctdk.phieuDangKyId,
            CONVERT(varchar, (CAST(MIN(ngayThi) AS DATETIME) + CAST(MIN(gioBatDau) AS DATETIME)), 120) AS dueDate
          FROM ChiTietDangKy ctdk
          INNER JOIN LichThi lt ON ctdk.lichThiId = lt.lichThiId
          WHERE ctdk.daChoXepLich = 1
          GROUP BY ctdk.phieuDangKyId
        ) nt ON tt.phieuDangKyId = nt.phieuDangKyId
        WHERE tt.trangThai = @param0
        ORDER BY tt.hanThanhToan DESC
      `,
        [trangThai],
      )
      return result.recordset
    } catch (error) {
      console.error("Error fetching thanh toan by status:", error)
      throw new Error("Failed to fetch thanh toan")
    }
  }

  async findAll(): Promise<ThanhToan[]> {
    try {
      const result = await this.db.executeQuery(`
        SELECT 
          tt.thanhToanId,
          tt.soTienBanDau,
          CONVERT(varchar, tt.hanThanhToan, 120) as hanThanhToan,
          tt.soTienGiamGia,
          tt.tongSoTien,
          tt.loaiThanhToan,
          tt.trangThai,
          tt.troGiaId,
          tt.nhanVienId,
          tt.phieuDangKyId,
          tt.phieuGiaHanId,
          kh.hoTen as customerName,
          kh.email,
          kh.soDienThoai as phone,
          pdk.loaiChungChi as certificate,
          CONVERT(varchar, pdk.ngayDangKy, 120) as registrationDate,
          nt.dueDate,
          CASE 
            WHEN tt.hanThanhToan < GETDATE() AND tt.trangThai = N'Chưa lập hóa đơn' THEN 'overdue'
            WHEN tt.trangThai = N'Đã lập hóa đơn' THEN 'invoice_created'
            ELSE 'pending'
          END as status,
          CONVERT(varchar, pdk.ngayDangKy, 120) as createdDate
        FROM ThanhToan tt
        LEFT JOIN PhieuDangKy pdk ON tt.phieuDangKyId = pdk.phieuDangKyId
        LEFT JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
        LEFT JOIN (
          SELECT 
            ctdk.phieuDangKyId,
            CONVERT(varchar, (CAST(MIN(ngayThi) AS DATETIME) + CAST(MIN(gioBatDau) AS DATETIME)), 120) AS dueDate
          FROM ChiTietDangKy ctdk
          INNER JOIN LichThi lt ON ctdk.lichThiId = lt.lichThiId
          WHERE ctdk.daChoXepLich = 1
          GROUP BY ctdk.phieuDangKyId
        ) nt ON tt.phieuDangKyId = nt.phieuDangKyId
        ORDER BY tt.hanThanhToan DESC
      `)
      return result.recordset
    } catch (error) {
      console.error("Error fetching thanh toan:", error)
      throw new Error("Failed to fetch thanh toan")
    }
  }

  async findById(id: string): Promise<ThanhToan | null> {
    try {
      const result = await this.db.executeQuery(
        `
        SELECT 
          tt.thanhToanId,
          tt.soTienBanDau,
          CONVERT(varchar, tt.hanThanhToan, 120) as hanThanhToan,
          tt.soTienGiamGia,
          tt.tongSoTien,
          tt.loaiThanhToan,
          tt.trangThai,
          tt.troGiaId,
          tt.nhanVienId,
          tt.phieuDangKyId,
          tt.phieuGiaHanId,
          kh.hoTen as customerName,
          kh.email,
          kh.soDienThoai as phone,
          pdk.loaiChungChi as certificate,
          CONVERT(varchar, pdk.ngayDangKy, 120) as registrationDate,
          nt.dueDate,
          CASE 
            WHEN tt.hanThanhToan < GETDATE() AND tt.trangThai = N'Chưa lập hóa đơn' THEN 'overdue'
            WHEN tt.trangThai = N'Đã lập hóa đơn' THEN 'invoice_created'
            ELSE 'pending'
          END as status,
          CONVERT(varchar, pdk.ngayDangKy, 120) as createdDate
        FROM ThanhToan tt
        LEFT JOIN PhieuDangKy pdk ON tt.phieuDangKyId = pdk.phieuDangKyId
        LEFT JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
        LEFT JOIN (
          SELECT 
            ctdk.phieuDangKyId,
            CONVERT(varchar, (CAST(MIN(ngayThi) AS DATETIME) + CAST(MIN(gioBatDau) AS DATETIME)), 120) AS dueDate
          FROM ChiTietDangKy ctdk
          INNER JOIN LichThi lt ON ctdk.lichThiId = lt.lichThiId
          WHERE ctdk.daChoXepLich = 1
          GROUP BY ctdk.phieuDangKyId
        ) nt ON tt.phieuDangKyId = nt.phieuDangKyId
        WHERE tt.thanhToanId = @param0
      `,
        [id],
      )

      return result.recordset.length > 0 ? result.recordset[0] : null
    } catch (error) {
      console.error("Error fetching thanh toan by ID:", error)
      throw new Error("Failed to fetch thanh toan")
    }
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

  async create(thanhToan: Omit<ThanhToan, "thanhToanId">): Promise<string> {
    try {
      const thanhToanId = `TT${Date.now()}`

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
          thanhToan.soTienGiamGia,
          thanhToan.tongSoTien,
          thanhToan.loaiThanhToan,
          thanhToan.trangThai || "Chưa lập hóa đơn",
          thanhToan.troGiaId,
          thanhToan.nhanVienId,
          thanhToan.phieuDangKyId,
          thanhToan.phieuGiaHanId,
        ],
      )

      return thanhToanId
    } catch (error) {
      console.error("Error creating thanh toan:", error)
      throw new Error("Failed to create thanh toan")
    }
  }
}
