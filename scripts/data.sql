-- Seed data for the new database structure

-- Insert sample NhanVien
INSERT INTO NhanVien (nhanVienId, hoTen, email, soDienThoai, chucVu) VALUES 
('NV001', N'Nguyễn Văn Admin', 'admin@company.com', '0901234567', N'Quản lý'),
('NV002', N'Trần Thị Hỗ trợ', 'support@company.com', '0987654321', N'Nhân viên');

-- Insert sample TroGia
INSERT INTO TroGia (troGiaId, tenTroGia, phanTramGiam, soTienGiam, dieuKien) VALUES 
('TG001', N'Giảm giá đơn vị 20 thí sinh', 5.00, 0, N'Từ 20 thí sinh trở lên'),
('TG002', N'Giảm giá đơn vị 30 thí sinh', 10.00, 0, N'Từ 30 thí sinh trở lên'),
('TG003', N'Giảm giá sinh viên', 15.00, 0, N'Dành cho sinh viên');

-- Insert sample KhachHang
INSERT INTO KhachHang (khachHangId, hoTen, email, diaChi, soDienThoai, loaiKhachHang) VALUES 
('KH001', N'Nguyễn Văn A', 'nguyenvana@example.com', N'123 Đường ABC, Quận 1, TP.HCM', '0901234567', N'Tự do'),
('KH002', N'Trường THPT Nguyễn Trãi', 'phamnam@truongthpt.edu.vn', N'456 Đường XYZ, Quận 3, TP.HCM', '0978561412', N'Đơn vị'),
('KH003', N'Công ty TNHH XYZ', 'contact@xyz.com', N'789 Đường DEF, Quận 5, TP.HCM', '0987654321', N'Đơn vị');

-- Insert sample PhieuDangKy
INSERT INTO PhieuDangKy (phieuDangKyId, ngayDangKy, daThanhToan, soLuongThiSinh, daDuyet, daHuy, thoiGianMongMuon, loaiChungChi, ghiChu, nhanVienId, khachHangId) VALUES 
('PDK001', '2025-07-08', 0, 1, 0, 0, '2025-07-15 09:00:00', N'Chứng chỉ Tin học Văn phòng', '', 'NV001', 'KH001'),
('PDK002', '2025-07-09', 0, 30, 0, 0, '2025-07-16 09:00:00', N'Chứng chỉ Tin học Nâng cao', 'Offline', 'NV001', 'KH002'),
('PDK003', '2025-07-10', 1, 5, 1, 0, '2025-07-17 09:00:00', N'Chứng chỉ Ứng dụng Công nghệ thông tin', 'Online', 'NV002', 'KH003');

-- Insert sample ThanhToan
INSERT INTO ThanhToan (thanhToanId, soTienBanDau, hanThanhToan, soTienGiamGia, tongSoTien, loaiThanhToan, trangThai, troGiaId, nhanVienId, phieuDangKyId, phieuGiaHanId) VALUES 
('TT001', 1500000, '2025-07-11 23:59:59', 0, 1500000, N'Chuyển khoản', N'Chưa lập hóa đơn', NULL, 'NV001', 'PDK001', NULL),
('TT002', 15000000, '2025-07-12 23:59:59', 1500000, 13500000, N'Chuyển khoản', N'Đã lập hóa đơn', 'TG002', 'NV001', 'PDK002', NULL),
('TT003', 7500000, '2025-07-13 23:59:59', 1125000, 6375000, N'Tiền mặt', N'Đã lập hóa đơn', 'TG003', 'NV002', 'PDK003', NULL);

-- Insert sample HoaDon (some payments already have invoices)
INSERT INTO HoaDon (ngayTao, ngayThanhToan, hinhThucThanhToan, thanhToanId, trangThai) VALUES 
('2025-07-10 10:30:00', '2025-07-10 14:20:00', N'Tiền mặt', 'TT003', N'Đã thanh toán'),
('2025-07-09 14:15:00', NULL, N'Chuyển khoản', 'TT002', N'Đã gửi');

-- Insert sample ChiTietDangKy data
-- This links students to their registration forms and exam schedules

-- PDK001 - Individual student (1 student)
INSERT INTO ChiTietDangKy (phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId) VALUES 
('PDK001', 'TS001', 1500000, 1, 'LT001');

-- PDK002 - Trường THPT Nguyễn Trãi (30 students) - Spread across multiple exam slots
INSERT INTO ChiTietDangKy (phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId) VALUES 
-- First batch - LT002 (25 students max, so 25 students)
('PDK002', 'TS003', 500000, 1, 'LT002'),
('PDK002', 'TS004', 500000, 1, 'LT002'),
('PDK002', 'TS005', 500000, 1, 'LT002'),
('PDK002', 'TS006', 500000, 1, 'LT002'),
('PDK002', 'TS007', 500000, 1, 'LT002'),
('PDK002', 'TS008', 500000, 1, 'LT002'),
('PDK002', 'TS009', 500000, 1, 'LT002'),
('PDK002', 'TS010', 500000, 1, 'LT002'),
('PDK002', 'TS011', 500000, 1, 'LT002'),
('PDK002', 'TS012', 500000, 1, 'LT002'),
('PDK002', 'TS013', 500000, 1, 'LT002'),
('PDK002', 'TS014', 500000, 1, 'LT002'),
('PDK002', 'TS015', 500000, 1, 'LT002'),
('PDK002', 'TS016', 500000, 1, 'LT002'),
('PDK002', 'TS017', 500000, 1, 'LT002'),
('PDK002', 'TS018', 500000, 1, 'LT002'),
('PDK002', 'TS019', 500000, 1, 'LT002'),
('PDK002', 'TS020', 500000, 1, 'LT002'),
('PDK002', 'TS021', 500000, 1, 'LT002'),
('PDK002', 'TS022', 500000, 1, 'LT002'),
('PDK002', 'TS023', 500000, 1, 'LT002'),
('PDK002', 'TS024', 500000, 1, 'LT002'),
('PDK002', 'TS025', 500000, 1, 'LT002'),
('PDK002', 'TS026', 500000, 1, 'LT002'),
('PDK002', 'TS027', 500000, 1, 'LT002'),

-- Remaining 5 students in LT003
('PDK002', 'TS028', 500000, 1, 'LT003'),
('PDK002', 'TS029', 500000, 1, 'LT003'),
('PDK002', 'TS030', 500000, 1, 'LT003'),
('PDK002', 'TS031', 500000, 1, 'LT003'),
('PDK002', 'TS032', 500000, 1, 'LT003');

-- PDK003 - Công ty TNHH XYZ (5 students) - All in one exam slot
INSERT INTO ChiTietDangKy (phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId) VALUES 
('PDK003', 'TS033', 1500000, 1, 'LT004'),
('PDK003', 'TS034', 1500000, 1, 'LT004'),
('PDK003', 'TS035', 1500000, 1, 'LT004'),
('PDK003', 'TS036', 1500000, 1, 'LT004'),
('PDK003', 'TS037', 1500000, 1, 'LT004');

-- Create indexes for better performance
CREATE INDEX IX_ChiTietDangKy_PhieuDangKyId ON ChiTietDangKy(phieuDangKyId);
CREATE INDEX IX_ChiTietDangKy_ThiSinhId ON ChiTietDangKy(thiSinhId);
CREATE INDEX IX_ChiTietDangKy_LichThiId ON ChiTietDangKy(lichThiId);
CREATE INDEX IX_ChiTietDangKy_DaChoXepLich ON ChiTietDangKy(daChoXepLich);

-- Insert sample data for LichThi (Exam Schedule)
INSERT INTO LichThi (lichThiId, ngayThi, gioBatDau, gioKetThuc, diaDiem, soLuongToiDa) VALUES 
-- Week 1 - July 2025
('LT001', '2025-07-15', '08:00:00', '10:00:00', N'Phòng Lab 1 - Tầng 2', 30),
('LT002', '2025-07-15', '10:30:00', '12:30:00', N'Phòng Lab 2 - Tầng 2', 25),
('LT003', '2025-07-15', '14:00:00', '16:00:00', N'Phòng Lab 3 - Tầng 3', 35),
('LT004', '2025-07-16', '08:00:00', '10:00:00', N'Phòng Lab 1 - Tầng 2', 30),
('LT005', '2025-07-16', '10:30:00', '12:30:00', N'Phòng Lab 4 - Tầng 3', 20),
('LT006', '2025-07-16', '14:00:00', '16:00:00', N'Phòng Lab 2 - Tầng 2', 25),

-- Week 2 - July 2025
('LT007', '2025-07-17', '08:00:00', '10:00:00', N'Phòng Lab 1 - Tầng 2', 30),
('LT008', '2025-07-17', '10:30:00', '12:30:00', N'Phòng Lab 3 - Tầng 3', 35),
('LT009', '2025-07-17', '14:00:00', '16:00:00', N'Phòng Lab 5 - Tầng 4', 40),
('LT010', '2025-07-18', '08:00:00', '10:00:00', N'Phòng Lab 2 - Tầng 2', 25),
('LT011', '2025-07-18', '10:30:00', '12:30:00', N'Phòng Lab 4 - Tầng 3', 20),
('LT012', '2025-07-18', '14:00:00', '16:00:00', N'Phòng Lab 1 - Tầng 2', 30),

-- Week 3 - July 2025
('LT013', '2025-07-19', '08:00:00', '10:00:00', N'Phòng Lab 3 - Tầng 3', 35),
('LT014', '2025-07-19', '10:30:00', '12:30:00', N'Phòng Lab 5 - Tầng 4', 40),
('LT015', '2025-07-19', '14:00:00', '16:00:00', N'Phòng Lab 2 - Tầng 2', 25),
('LT016', '2025-07-22', '08:00:00', '10:00:00', N'Phòng Lab 1 - Tầng 2', 30),
('LT017', '2025-07-22', '10:30:00', '12:30:00', N'Phòng Lab 4 - Tầng 3', 20),
('LT018', '2025-07-22', '14:00:00', '16:00:00', N'Phòng Lab 3 - Tầng 3', 35),

-- Week 4 - July 2025
('LT019', '2025-07-23', '08:00:00', '10:00:00', N'Phòng Lab 5 - Tầng 4', 40),
('LT020', '2025-07-23', '10:30:00', '12:30:00', N'Phòng Lab 1 - Tầng 2', 30),
('LT021', '2025-07-23', '14:00:00', '16:00:00', N'Phòng Lab 2 - Tầng 2', 25),
('LT022', '2025-07-24', '08:00:00', '10:00:00', N'Phòng Lab 4 - Tầng 3', 20),
('LT023', '2025-07-24', '10:30:00', '12:30:00', N'Phòng Lab 3 - Tầng 3', 35),
('LT024', '2025-07-24', '14:00:00', '16:00:00', N'Phòng Lab 5 - Tầng 4', 40),

-- August 2025 - Additional slots
('LT025', '2025-08-01', '08:00:00', '10:00:00', N'Phòng Lab 1 - Tầng 2', 30),
('LT026', '2025-08-01', '10:30:00', '12:30:00', N'Phòng Lab 2 - Tầng 2', 25),
('LT027', '2025-08-01', '14:00:00', '16:00:00', N'Phòng Lab 3 - Tầng 3', 35),
('LT028', '2025-08-02', '08:00:00', '10:00:00', N'Phòng Lab 4 - Tầng 3', 20),
('LT029', '2025-08-02', '10:30:00', '12:30:00', N'Phòng Lab 5 - Tầng 4', 40),
('LT030', '2025-08-02', '14:00:00', '16:00:00', N'Phòng Lab 1 - Tầng 2', 30);

-- Create indexes for better performance
CREATE INDEX IX_LichThi_NgayThi ON LichThi(ngayThi);
CREATE INDEX IX_LichThi_DiaDiem ON LichThi(diaDiem);

INSERT INTO KhachHang (khachHangId, hoTen, email, diaChi, soDienThoai, loaiKhachHang) VALUES 
('KH004', N'Nguyễn Thị B', 'nguyenthib@example.com', N'321 Đường GHI, Quận 7, TP.HCM', '0912345678', N'Tự do'),
('KH005', N'Công ty ABC', 'info@abc.com', N'654 Đường JKL, Quận 2, TP.HCM', '0923456789', N'Đơn vị');

-- Insert sample ThiSinh data
INSERT INTO ThiSinh (thiSinhId, hoTen, ngaySinh, cccd, khachHangId) VALUES 
-- Individual customers (Tự do)
('TS001', N'Nguyễn Văn A', '1995-03-15', '123456789012', 'KH001'),
('TS002', N'Nguyễn Thị B', '1998-07-22', '234567890123', 'KH004'),

-- Organization customers - Multiple students per organization
-- Trường THPT Nguyễn Trãi (KH002) - 30 students
('TS003', N'Trần Văn C', '2005-01-10', '345678901234', 'KH002'),
('TS004', N'Lê Thị D', '2005-02-15', '456789012345', 'KH002'),
('TS005', N'Phạm Văn E', '2005-03-20', '567890123456', 'KH002'),
('TS006', N'Hoàng Thị F', '2005-04-25', '678901234567', 'KH002'),
('TS007', N'Vũ Văn G', '2005-05-30', '789012345678', 'KH002'),
('TS008', N'Đặng Thị H', '2005-06-05', '890123456789', 'KH002'),
('TS009', N'Bùi Văn I', '2005-07-10', '901234567890', 'KH002'),
('TS010', N'Ngô Thị K', '2005-08-15', '012345678901', 'KH002'),
('TS011', N'Dương Văn L', '2005-09-20', '123450678902', 'KH002'),
('TS012', N'Tạ Thị M', '2005-10-25', '234561789013', 'KH002'),
('TS013', N'Lý Văn N', '2005-11-30', '345672890124', 'KH002'),
('TS014', N'Võ Thị O', '2005-12-05', '456783901235', 'KH002'),
('TS015', N'Trịnh Văn P', '2006-01-10', '567894012346', 'KH002'),
('TS016', N'Đinh Thị Q', '2006-02-15', '678905123457', 'KH002'),
('TS017', N'Hồ Văn R', '2006-03-20', '789016234568', 'KH002'),
('TS018', N'Mai Thị S', '2006-04-25', '890127345679', 'KH002'),
('TS019', N'Chu Văn T', '2006-05-30', '901238456780', 'KH002'),
('TS020', N'Lưu Thị U', '2006-06-05', '012349567891', 'KH002'),
('TS021', N'Từ Văn V', '2006-07-10', '123450678902', 'KH002'),
('TS022', N'Ông Thị W', '2006-08-15', '234561789013', 'KH002'),
('TS023', N'Uông Văn X', '2006-09-20', '345672890124', 'KH002'),
('TS024', N'Ứng Thị Y', '2006-10-25', '456783901235', 'KH002'),
('TS025', N'Ưng Văn Z', '2006-11-30', '567894012346', 'KH002'),
('TS026', N'Âu Thị AA', '2006-12-05', '678905123457', 'KH002'),
('TS027', N'Ấu Văn BB', '2007-01-10', '789016234568', 'KH002'),
('TS028', N'Ầu Thị CC', '2007-02-15', '890127345679', 'KH002'),
('TS029', N'Ẩu Văn DD', '2007-03-20', '901238456780', 'KH002'),
('TS030', N'Ậu Thị EE', '2007-04-25', '012349567891', 'KH002'),
('TS031', N'Ắc Văn FF', '2007-05-30', '123450678902', 'KH002'),
('TS032', N'Ặc Thị GG', '2007-06-05', '234561789013', 'KH002'),

-- Công ty TNHH XYZ (KH003) - 5 students
('TS033', N'Nguyễn Văn HH', '1990-01-15', '345672890124', 'KH003'),
('TS034', N'Trần Thị II', '1992-03-20', '456783901235', 'KH003'),
('TS035', N'Lê Văn JJ', '1988-05-25', '567894012346', 'KH003'),
('TS036', N'Phạm Thị KK', '1995-07-30', '678905123457', 'KH003'),
('TS037', N'Hoàng Văn LL', '1993-09-10', '789016234568', 'KH003'),

-- Công ty ABC (KH005) - 25 students
('TS038', N'Vũ Văn MM', '1991-02-12', '890127345679', 'KH005'),
('TS039', N'Đặng Thị NN', '1994-04-18', '901238456780', 'KH005'),
('TS040', N'Bùi Văn OO', '1989-06-22', '012349567891', 'KH005'),
('TS041', N'Ngô Thị PP', '1996-08-28', '123450678902', 'KH005'),
('TS042', N'Dương Văn QQ', '1987-10-14', '234561789013', 'KH005'),
('TS043', N'Tạ Thị RR', '1992-12-19', '345672890124', 'KH005'),
('TS044', N'Lý Văn SS', '1990-01-25', '456783901235', 'KH005'),
('TS045', N'Võ Thị TT', '1993-03-30', '567894012346', 'KH005'),
('TS046', N'Trịnh Văn UU', '1988-05-15', '678905123457', 'KH005'),
('TS047', N'Đinh Thị VV', '1995-07-20', '789016234568', 'KH005'),
('TS048', N'Hồ Văn WW', '1991-09-25', '890127345679', 'KH005'),
('TS049', N'Mai Thị XX', '1994-11-30', '901238456780', 'KH005'),
('TS050', N'Chu Văn YY', '1989-01-05', '012349567891', 'KH005'),
('TS051', N'Lưu Thị ZZ', '1996-03-10', '123450678902', 'KH005'),
('TS052', N'Từ Văn AAA', '1987-05-15', '234561789013', 'KH005'),
('TS053', N'Ông Thị BBB', '1992-07-20', '345672890124', 'KH005'),
('TS054', N'Uông Văn CCC', '1990-09-25', '456783901235', 'KH005'),
('TS055', N'Ứng Thị DDD', '1993-11-30', '567894012346', 'KH005'),
('TS056', N'Ưng Văn EEE', '1988-01-15', '678905123457', 'KH005'),
('TS057', N'Âu Thị FFF', '1995-03-20', '789016234568', 'KH005'),
('TS058', N'Ấu Văn GGG', '1991-05-25', '890127345679', 'KH005'),
('TS059', N'Ầu Thị HHH', '1994-07-30', '901238456780', 'KH005'),
('TS060', N'Ẩu Văn III', '1989-09-15', '012349567891', 'KH005'),
('TS061', N'Ậu Thị JJJ', '1996-11-20', '123450678902', 'KH005'),
('TS062', N'Ắc Văn KKK', '1987-01-25', '234561789013', 'KH005');

-- Create indexes for better performance
CREATE INDEX IX_ThiSinh_KhachHangId ON ThiSinh(khachHangId);
CREATE INDEX IX_ThiSinh_CCCD ON ThiSinh(cccd);

