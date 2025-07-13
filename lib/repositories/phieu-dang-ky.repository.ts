// Repository for PhieuDangKy
import { createConnection } from "@/lib/database/connection"
import { PhieuDangKy } from "../models/phieu-dang-ky.model"

export class PhieuDangKyRepository {
  async findAll(): Promise<PhieuDangKy[]> {
    const conn = await createConnection()
    try {
      const query = `
        SELECT 
          pdk.phieuDangKyId,
          pdk.ngayDangKy,
          pdk.daThanhToan,
          pdk.soLuongThiSinh,
          pdk.daDuyet,
          pdk.daHuy,
          pdk.thoiGianMongMuon,
          pdk.ghiChu,
          pdk.loaiChungChi,
          kh.hoTen as customerName,
          kh.email,
          kh.soDienThoai as phone,
          kh.loaiKhachHang,
          lkt.giaHienTai as price
        FROM PhieuDangKy pdk
        INNER JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
        INNER JOIN LoaiKiemTra lkt ON pdk.loaiKiemTraId = lkt.loaiKiemTraId
        ORDER BY pdk.ngayDangKy DESC
      `
      const result = await conn.request().query(query)
      return result.recordset as PhieuDangKy[]
    } catch (error) {
      console.error("Database error:", error)
      throw new Error("Failed to fetch phieu dang ky")
    } finally {
      conn.close()
    }
  }

  async findPending(): Promise<PhieuDangKy[]> {
    const conn = await createConnection()
    try {
      const query = `
        SELECT 
          pdk.phieuDangKyId,
          pdk.ngayDangKy,
          pdk.daThanhToan,
          pdk.soLuongThiSinh,
          pdk.daDuyet,
          pdk.daHuy,
          pdk.thoiGianMongMuon,
          pdk.ghiChu,
          pdk.loaiChungChi,
          kh.hoTen as customerName,
          kh.email,
          kh.soDienThoai as phone,
          kh.loaiKhachHang,
          lkt.giaHienTai as price
        FROM PhieuDangKy pdk
        INNER JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
        INNER JOIN LoaiKiemTra lkt ON pdk.loaiKiemTraId = lkt.loaiKiemTraId
        WHERE pdk.daThanhToan = 0 AND pdk.daDuyet = 1 AND pdk.daHuy = 0
        ORDER BY pdk.ngayDangKy DESC
      `
      const result = await conn.request().query(query)
      return result.recordset as PhieuDangKy[]
    } catch (error) {
      console.error("Database error:", error)
      throw new Error("Failed to fetch pending phieu dang ky")
    } finally {
      conn.close()
    }
  }

  async findById(id: string): Promise<PhieuDangKy | null> {
    const conn = await createConnection()
    try {
      const query = `
        SELECT 
          pdk.phieuDangKyId,
          pdk.ngayDangKy,
          pdk.daThanhToan,
          pdk.soLuongThiSinh,
          pdk.daDuyet,
          pdk.daHuy,
          pdk.thoiGianMongMuon,
          pdk.ghiChu,
          pdk.loaiChungChi,
          kh.hoTen as customerName,
          kh.email,
          kh.soDienThoai as phone,
          kh.loaiKhachHang,
          lkt.giaHienTai as price
        INNER JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
        INNER JOIN LoaiKiemTra lkt ON pdk.loaiKiemTraId = lkt.loaiKiemTraId
        WHERE pdk.phieuDangKyId = @id
      `
      const result = await conn.request().input("id", id).query(query)
      return result.recordset[0] as PhieuDangKy || null
    } catch (error) {
      console.error("Database error:", error)
      throw new Error(`Failed to fetch phieu dang ky with ID: ${id}`)
    } finally {
      conn.close()
    }
  }

  async updatePaymentStatus(id: string, paid: boolean): Promise<void> {
    const conn = await createConnection()
    try {
      const query = `
        UPDATE PhieuDangKy
        SET daThanhToan = @paid
        WHERE phieuDangKyId = @id
      `
      await conn.request()
        .input("id", id)
        .input("paid", paid ? 1 : 0)
        .query(query)
    } catch (error) {
      console.error("Database error:", error)
      throw new Error(`Failed to update payment status for phieu dang ky: ${id}`)
    } finally {
      conn.close()
    }
  }
} 