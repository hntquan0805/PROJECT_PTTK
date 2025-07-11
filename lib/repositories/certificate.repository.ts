import { DatabaseConnection } from "../database/connection"
import type { CertificateDetailsData } from "../models/certificate.model"

export class CertificateRepository {
  private db: DatabaseConnection

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async findByCertificateCode(maChungChi: string): Promise<CertificateDetailsData | null> {
    const result = await this.db.executeQuery(
      `
      SELECT
        CC.chungChiId AS soChungChi,
        CC.tenChungChi AS loaiChungChi,
        CC.loaiChungChi AS capDo,
        CC.hinhThucNhan AS donViCap,
        CC.daNhanBang AS trangThai,
        CONVERT(varchar, CC.ngayCap, 120) AS ngayCap,
        
        KQ.diemThi,
        CONVERT(varchar, KQ.ngayCongBoKetQua, 120) AS coHieuLucDen,

        CONVERT(varchar, PDT.ngayPhatHanh, 120) AS ngayThi,

        TS.hoTen AS hoVaTen,
        CONVERT(varchar, TS.ngaySinh, 120) AS ngaySinh,
        KH.soDienThoai AS dienThoai,
        KH.email

      FROM ChungChi CC
      JOIN KetQuaThi KQ ON KQ.chungChiId = CC.chungChiId
      JOIN PhieuDuThi PDT ON KQ.phieuDuThiId = PDT.phieuDuThiId
      JOIN ChiTietDangKy CTDK ON CTDK.chiTietDangKyId = PDT.chiTietDangKyId
      JOIN ThiSinh TS ON CTDK.thiSinhId = TS.thiSinhId
      JOIN KhachHang KH ON KH.khachHangId = TS.khachHangId
      WHERE CC.chungChiId  = @param0
    `,
      [maChungChi]
    )

    if (result.recordset.length === 0) return null

    const row = result.recordset[0]

    return {
      certificate: {
        maChungChi,
        ngayThi: row.ngayThi,
        soChungChi: row.soChungChi,
        diemThi: row.diemThi,
        loaiChungChi: row.loaiChungChi,
        ngayCap: row.ngayCap,
        capDo: row.capDo,
        coHieuLucDen: row.coHieuLucDen,
        trangThai: row.trangThai ? "Đã cấp" : "Chưa cấp",
        donViCap: row.donViCap
      },
      candidate: {
        hoVaTen: row.hoVaTen,
        ngaySinh: row.ngaySinh,
        dienThoai: row.dienThoai,
        email: row.email
      },
      notes: "Chứng chỉ hợp lệ trong 2 năm"
    }
  }
}
