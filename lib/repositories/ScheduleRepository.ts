// Data Access Layer - Updated HoaDon Repository
import { RegistrationInfoForm } from "@/features/registration/schemas";
import { DatabaseConnection } from "../database/connection"; // chỉnh lại path nếu khác
import ScheduleOption from "../models/ScheduleOption"; // nơi bạn định nghĩa interface
import sql from "mssql";
import { v4 as uuidv4 } from "uuid";

export class ScheduleRepository {
  private db = DatabaseConnection.getInstance();

  public async getScheduleOptions(): Promise<ScheduleOption[]> {
    const query = `
        SELECT 
          lt.lichThiId,
          lt.ngayThi,
          lt.thoiGianThi,
          lt.soThiSinhToiDa,
          lt.soThiSinhDaDangKy,
          lkt.tenKiemTra
        FROM LichThi lt
        JOIN LoaiKiemTra lkt ON lt.loaiKiemTraId = lkt.loaiKiemTraId
        WHERE lkt.trangThai = N'active'
        ORDER BY lt.ngayThi, lt.thoiGianThi
      `;

    const result = await this.db.executeQuery(query);
    const rows = result.recordset;

    const scheduleOptions: ScheduleOption[] = rows.map((row: any) => {
      // Xử lý type
      const type = row.tenKiemTra.includes("Tin học") ? "it" : "english";

      // Xử lý level
      const levelMatch = row.tenKiemTra.match(/(A2|B1|B2|Cơ bản|Nâng cao)/i);
      const level = levelMatch ? levelMatch[0] : "Không xác định";
      const time = new Date(row.thoiGianThi).toISOString().slice(11, 16);
      return {
        id: row.lichThiId.toString(),
        date: row.ngayThi.toISOString().split("T")[0],
        time: time,
        type: type,
        level: level,
        maxCapacity: row.soThiSinhToiDa,
        availableSlots: row.soThiSinhToiDa - row.soThiSinhDaDangKy,
      };
    });

    return scheduleOptions;
  }

  public async register(info: RegistrationInfoForm) {
    const pool = await this.db.connect();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      // --- 1. Insert KhachHang ---
      const khRequest = new sql.Request(transaction);
      khRequest.input("khachHangId", sql.VarChar, uuidv4());
      khRequest.input("hoTen", sql.NVarChar, info.registrantName);
      khRequest.input("email", sql.NVarChar, info.registrantEmail || null);
      khRequest.input("soDienThoai", sql.VarChar, info.registrantPhone);
      khRequest.input(
        "loaiKhachHang",
        sql.NVarChar,
        info.customerType === "individual" ? "Tự do" : "Đơn vị"
      );
      khRequest.input("diaChi", sql.NVarChar, "");
      console.log("CHECK@");
      const khachHangResult = await khRequest.query(`
          INSERT INTO KhachHang (khachHangId, hoTen, email, soDienThoai, loaiKhachHang, diaChi)
          OUTPUT INSERTED.khachHangId
          VALUES (@khachHangId, @hoTen, @email, @soDienThoai, @loaiKhachHang, @diaChi)
        `);
      console.log("CHECK@@");
      const khachHangId = khachHangResult.recordset[0].khachHangId;

      // --- 2. Insert ThiSinh ---
      const tsId = uuidv4();
      const tsRequest = new sql.Request(transaction);
      tsRequest.input("thiSinhId", sql.VarChar, tsId);
      tsRequest.input("hoTen", sql.NVarChar, info.examineeName);
      tsRequest.input("cccd", sql.VarChar, info.examineeId);
      tsRequest.input("ngaySinh", sql.DateTime, null); // bạn có thể bổ sung sau
      tsRequest.input("khachHangId", sql.VarChar, khachHangId);
      const thiSinhResult = await tsRequest.query(`
          INSERT INTO ThiSinh (thiSinhId, hoTen, ngaySinh, cccd, khachHangId)
          OUTPUT INSERTED.thiSinhId
          VALUES (@thiSinhId, @hoTen, @ngaySinh, @cccd, @khachHangId)
        `);

      const thiSinhId = thiSinhResult.recordset[0].thiSinhId;
      // --- 3. Insert PhieuDangKy ---
      const pdkId = uuidv4();
      const pdRequest = new sql.Request(transaction);
      pdRequest.input("phieuDangKyId", sql.VarChar, pdkId);
      pdRequest.input("ngayDangKy", sql.DateTime, new Date());
      pdRequest.input("daThanhToan", sql.Bit, false);
      pdRequest.input("soLuongThiSinh", sql.Int, 1);
      pdRequest.input("daDuyet", sql.Bit, false);
      pdRequest.input("daHuy", sql.Bit, false);
      pdRequest.input("thoiGianMongMuon", sql.NVarChar, null);
      pdRequest.input("ghiChu", sql.NVarChar, "");
      pdRequest.input(
        "loaiChungChi",
        sql.NVarChar,
        info.selectedSchedules[0]?.type === "it" ? "Tin học" : "Tiếng Anh"
      );
      pdRequest.input("nhanVienId", sql.Int, null);
      pdRequest.input("khachHangId", sql.VarChar, khachHangId);

      const phieuResult = await pdRequest.query(`
          INSERT INTO PhieuDangKy (phieuDangKyId, ngayDangKy, daThanhToan, soLuongThiSinh, daDuyet, daHuy, thoiGianMongMuon, ghiChu, loaiChungChi, nhanVienId, khachHangId)
          OUTPUT INSERTED.phieuDangKyId
          VALUES (@phieuDangKyId, @ngayDangKy, @daThanhToan, @soLuongThiSinh, @daDuyet, @daHuy, @thoiGianMongMuon, @ghiChu, @loaiChungChi, @nhanVienId, @khachHangId)
        `);
      const phieuDangKyId = phieuResult.recordset[0].phieuDangKyId;

      // --- 4. Insert ChiTietDangKy (mỗi lịch thi) ---
      for (const schedule of info.selectedSchedules) {
        const ctdkId = uuidv4();
        const ctRequest = new sql.Request(transaction);
        ctRequest.input("chiTietDangKyId", sql.VarChar, ctdkId);
        ctRequest.input("phieuDangKyId", sql.VarChar, phieuDangKyId);
        ctRequest.input("thiSinhId", sql.VarChar, thiSinhId);
        ctRequest.input("giaLucDangKy", sql.Int, 0); // bạn có thể thay bằng giá từ LoaiKiemTra nếu cần
        ctRequest.input("daChoXepLich", sql.Bit, false);
        ctRequest.input("lichThiId", sql.Int, parseInt(schedule.id));

        await ctRequest.query(`
            INSERT INTO ChiTietDangKy (chiTietDangKyId, phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId)
            VALUES (@chiTietDangKyId, @phieuDangKyId, @thiSinhId, @giaLucDangKy, @daChoXepLich, @lichThiId)
          `);
      }

      await transaction.commit();
      return { success: true, phieuDangKyId };
    } catch (err) {
      await transaction.rollback();
      console.error("❌ Đăng ký thất bại:", err);
      throw err;
    }
  }
}
