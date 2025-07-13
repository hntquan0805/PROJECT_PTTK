-- Dữ liệu mẫu cho hệ thống hóa đơn thanh toán

-- Xóa dữ liệu cũ để tránh lỗi khóa chính
-- Dữ liệu bảng LoaiKiemTra
INSERT INTO LoaiKiemTra (tenKiemTra, trangThai, donViChamThi, donViCapBang, giaHienTai, conToChuc)
VALUES 
(N'IELTS', N'Đang mở', N'British Council', N'British Council', 4500000.00, 1),
(N'TOEIC', N'Đang mở', N'IIG Việt Nam', N'IIG Việt Nam', 1500000.00, 1),
(N'TOEFL', N'Đang mở', N'ETS', N'ETS', 5000000.00, 1),
(N'MOS', N'Đang mở', N'Microsoft', N'Microsoft', 1200000.00, 1),
(N'Adobe Photoshop', N'Đang mở', N'Certiport', N'Adobe', 1400000.00, 1),
(N'Adobe Illustrator', N'Đang mở', N'Certiport', N'Adobe', 1400000.00, 1),
(N'CCNA', N'Đang mở', N'Cisco', N'Cisco', 3500000.00, 1),
(N'IC3', N'Đang mở', N'Certiport', N'Certiport', 1200000.00, 1);

-- Dữ liệu bảng NguoiDung
INSERT INTO NguoiDung (nguoiDungId, username, password, loaiNguoiDung)
VALUES 
(1, 'admin', 'admin123', N'admin'),
(2, 'taichinh1', 'taichinh123', N'tài chính'),
(3, 'hanhchinh1', 'hanhchinh123', N'tổ chức hành chính');

-- Dữ liệu bảng NhanVien
INSERT INTO NhanVien (nhanVienId, hoTen, email, diaChi, soDienThoai, loaiNhanVien, trangThai, nguoiDungId)
VALUES 
('NV001', N'Nguyễn Văn An', 'an.nguyen@example.com', N'Hà Nội', '0901234567', N'Quản lý', N'Đang làm việc', 1),
('NV002', N'Trần Thị Bình', 'binh.tran@example.com', N'Hà Nội', '0912345678', N'Tài chính', N'Đang làm việc', 2),
('NV003', N'Lê Văn Cường', 'cuong.le@example.com', N'Hà Nội', '0923456789', N'Hành chính', N'Đang làm việc', 3);

-- Dữ liệu bảng LichThi với thông tin chi tiết hơn

-- Thêm dữ liệu mới cho LichThi
INSERT INTO LichThi (lichThiId, thoiGianThi, ngayThi, diaDiem, soThiSinhToiDa, soThiSinhDaDangKy, loaiKiemTraId)
VALUES 
('IELTS-2025-08-05', '08:00:00', '2025-08-05', N'Trung tâm Anh ngữ ABC - 123 Lê Lợi, Q.1, TP.HCM', 30, 10, 1),
('TOEIC-2025-08-10', '13:30:00', '2025-08-10', N'Trung tâm Anh ngữ XYZ - 456 Nguyễn Huệ, Q.1, TP.HCM', 50, 25, 2),
('TOEFL-2025-08-15', '09:00:00', '2025-08-15', N'Trung tâm Anh ngữ MNP - 789 Đồng Khởi, Q.1, TP.HCM', 20, 5, 3),
('MOS-2025-08-20', '14:00:00', '2025-08-20', N'Trung tâm Tin học DEF - 101 Lý Tự Trọng, Q.1, TP.HCM', 40, 15, 4),
('PHOTOSHOP-2025-08-12', '09:30:00', '2025-08-12', N'Trung tâm Đồ họa HJK - 202 Hai Bà Trưng, Q.1, TP.HCM', 30, 5, 5),
('ILLUSTRATOR-2025-08-18', '13:00:00', '2025-08-18', N'Trung tâm Đồ họa HJK - 202 Hai Bà Trưng, Q.1, TP.HCM', 25, 3, 6),
('CCNA-2025-08-22', '08:30:00', '2025-08-22', N'Trung tâm CNTT STU - 303 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 20, 8, 7),
('IC3-2025-08-25', '14:30:00', '2025-08-25', N'Trung tâm Tin học VWX - 404 Võ Văn Tần, Q.3, TP.HCM', 35, 10, 8);

-- Thêm lịch thi sắp tới để mở rộng dữ liệu
INSERT INTO LichThi (lichThiId, thoiGianThi, ngayThi, diaDiem, soThiSinhToiDa, soThiSinhDaDangKy, loaiKiemTraId)
VALUES 
('IELTS-2025-08-28', '08:00:00', '2025-08-28', N'Trung tâm Anh ngữ ABC - 123 Lê Lợi, Q.1, TP.HCM', 30, 0, 1),
('TOEIC-2025-08-30', '13:30:00', '2025-08-30', N'Trung tâm Anh ngữ XYZ - 456 Nguyễn Huệ, Q.1, TP.HCM', 50, 0, 2);

-- Dữ liệu bảng KhachHang
INSERT INTO KhachHang (khachHangId, hoTen, email, diaChi, soDienThoai, loaiKhachHang)
VALUES 
('KH001', N'Phạm Văn Đức', 'duc.pham@gmail.com', N'Hà Nội', '0912345678', N'Tự do'),
('KH002', N'Công ty TNHH ABC', 'contact@abc.com', N'TP. Hồ Chí Minh', '0823456789', N'Đơn vị'),
('KH003', N'Trường Đại học XYZ', 'contact@xyz.edu.vn', N'Đà Nẵng', '0934567890', N'Đơn vị'),
('KH004', N'Hoàng Thị Lan', 'lan.hoang@gmail.com', N'Hải Phòng', '0945678901', N'Tự do'),
('KH005', N'Trần Văn Khánh', 'khanh.tran@gmail.com', N'Quảng Ninh', '0956789012', N'Tự do'),
('KH006', N'Nguyễn Thị Hương', 'huong.nguyen@gmail.com', N'Cần Thơ', '0967890123', N'Tự do'),
('KH007', N'Công ty Cổ phần DEF', 'info@def.com.vn', N'Hà Nội', '0978901234', N'Đơn vị'),
('KH008', N'Trường Cao đẳng MNO', 'info@mno.edu.vn', N'TP. Hồ Chí Minh', '0989012345', N'Đơn vị');

-- Dữ liệu bảng ThiSinh
INSERT INTO ThiSinh (thiSinhId, hoTen, ngaySinh, cccd, khachHangId)
VALUES 
('TS001', N'Nguyễn Thị Mai', '2000-05-15', '123456789012', 'KH001'),
('TS002', N'Trần Văn Hùng', '1998-08-20', '234567890123', 'KH001'),
('TS003', N'Lê Thị Hà', '1995-03-10', '345678901234', 'KH002'),
('TS004', N'Phạm Văn Tuấn', '1999-12-05', '456789012345', 'KH002'),
('TS005', N'Hoàng Văn Nam', '2001-07-25', '567890123456', 'KH003'),
('TS006', N'Vũ Thị Linh', '2002-04-30', '678901234567', 'KH004'),
('TS007', N'Phan Văn Minh', '1997-09-18', '789012345678', 'KH005'),
('TS008', N'Đặng Thị Hà', '1999-11-22', '890123456789', 'KH005'),
('TS009', N'Lý Văn Hoàng', '2000-03-14', '901234567890', 'KH006'),
('TS010', N'Ngô Thị Thảo', '1998-06-28', '012345678901', 'KH006'),
('TS011', N'Vương Văn Đạt', '2001-01-05', '112233445566', 'KH007'),
('TS012', N'Trịnh Thị Mai', '2002-08-12', '223344556677', 'KH007'),
('TS013', N'Lưu Văn Hùng', '1999-05-20', '334455667788', 'KH007'),
('TS014', N'Đinh Thị Hương', '2000-10-15', '445566778899', 'KH007'),
('TS015', N'Bùi Văn Nam', '1997-03-30', '556677889900', 'KH007'),
('TS016', N'Mai Thị Lan', '1998-07-22', '667788990011', 'KH008'),
('TS017', N'Dương Văn Phúc', '2001-09-18', '778899001122', 'KH008'),
('TS018', N'Hà Thị Thu', '2002-11-05', '889900112233', 'KH008'),
('TS019', N'Tạ Văn Long', '1999-04-25', '990011223344', 'KH008'),
('TS020', N'Lương Thị Nhung', '2000-12-10', '001122334455', 'KH008');

-- Dữ liệu bảng TroGia
INSERT INTO TroGia (troGiaId, tiLeGiamGia, moTaChinhSach, soThiSinhToiThieu, truongHopMienPhiGiaHan, doiTuong, ngayBatDau, ngayKetThuc)
VALUES 
('TG001', 5.00, N'Giảm 5% cho nhóm từ 5 thí sinh', 5, NULL, N'Tự do', '2025-01-01', '2025-12-31'),
('TG002', 10.00, N'Giảm 10% cho đơn vị đăng ký từ 10 thí sinh', 10, NULL, N'Đơn vị', '2025-01-01', '2025-12-31'),
('TG003', 15.00, N'Giảm 15% cho trường học đăng ký từ 15 thí sinh', 15, NULL, N'Đơn vị', '2025-01-01', '2025-12-31');

-- Dữ liệu bảng PhieuDangKy
INSERT INTO PhieuDangKy (phieuDangKyId, ngayDangKy, daThanhToan, soLuongThiSinh, daDuyet, daHuy, thoiGianMongMuon, ghiChu, loaiChungChi, nhanVienId, khachHangId, loaiKiemTraId)
VALUES 
('PDK001', '2025-07-11', 0, 1, 1, 0, '2025-08-05 08:00:00', N'Đăng ký thi IELTS', N'IELTS', 'NV001', 'KH001', 1),
('PDK002', '2025-07-11', 0, 15, 1, 0, '2025-08-10 13:30:00', N'Đăng ký thi TOEIC cho nhân viên', N'TOEIC', 'NV001', 'KH002', 2),
('PDK003', '2025-07-12', 0, 20, 1, 0, '2025-08-15 09:00:00', N'Đăng ký thi TOEFL cho sinh viên', N'TOEFL', 'NV001', 'KH003', 3),
('PDK004', '2025-07-12', 0, 1, 1, 0, '2025-08-20 14:00:00', N'Đăng ký thi MOS', N'MOS', 'NV001', 'KH004', 4),
('PDK005', '2025-07-12', 0, 1, 1, 0, '2025-08-12 09:30:00', N'Đăng ký thi chứng chỉ Photoshop', N'Adobe Photoshop', 'NV001', 'KH005', 5),
('PDK006', '2025-07-12', 0, 1, 1, 0, '2025-08-18 13:00:00', N'Đăng ký thi chứng chỉ Illustrator', N'Adobe Illustrator', 'NV001', 'KH006', 6),
('PDK007', '2025-07-11', 0, 15, 1, 0, '2025-08-22 08:30:00', N'Đăng ký thi CCNA cho nhân viên IT', N'CCNA', 'NV001', 'KH007', 7),
('PDK008', '2025-07-12', 0, 15, 1, 0, '2025-08-25 14:30:00', N'Đăng ký thi IC3 cho sinh viên', N'IC3', 'NV001', 'KH008', 8),
('PDK009', '2025-07-11', 0, 1, 1, 0, '2025-08-05 08:00:00', N'Đăng ký thi IELTS đợt cuối năm', N'IELTS', 'NV002', 'KH006', 1),
('PDK010', '2025-07-12', 0, 18, 1, 0, '2025-08-10 13:30:00', N'Đăng ký thi TOEIC cho nhân viên khối kỹ thuật', N'TOEIC', 'NV002', 'KH007', 2),
('PDK011', '2025-07-11', 0, 22, 1, 0, '2025-08-15 09:00:00', N'Đăng ký thi TOEFL đợt cuối năm', N'TOEFL', 'NV003', 'KH008', 3),
('PDK012', '2025-07-10', 0, 25, 1, 0, '2025-08-20 14:00:00', N'Đăng ký thi MOS cho sinh viên khóa mới', N'MOS', 'NV003', 'KH008', 4);

-- Dữ liệu bảng ChiTietDangKy với thông tin thời gian chi tiết hơn
INSERT INTO ChiTietDangKy (chiTietDangKyId, phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId)
VALUES 
-- PDK001 - IELTS
('CTDK001', 'PDK001', 'TS001', 4500000.00, 1, 'IELTS-2025-08-05'),
('CTDK002', 'PDK001', 'TS002', 4500000.00, 1, 'IELTS-2025-08-05'),

-- PDK002 - TOEIC
('CTDK003', 'PDK002', 'TS003', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK004', 'PDK002', 'TS004', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK005', 'PDK003', 'TS005', 5000000.00, 1, 'TOEFL-2025-08-15'),
('CTDK006', 'PDK004', 'TS006', 1200000.00, 1, 'MOS-2025-08-20'),

-- PDK005 - Adobe Photoshop
('CTDK007', 'PDK005', 'TS007', 1400000.00, 1, 'PHOTOSHOP-2025-08-12'),
('CTDK008', 'PDK005', 'TS008', 1400000.00, 1, 'PHOTOSHOP-2025-08-12'),

-- PDK006 - Adobe Illustrator
('CTDK009', 'PDK006', 'TS009', 1400000.00, 1, 'ILLUSTRATOR-2025-08-18'),
('CTDK010', 'PDK006', 'TS010', 1400000.00, 1, 'ILLUSTRATOR-2025-08-18'),

-- PDK007 - CCNA
('CTDK011', 'PDK007', 'TS011', 3500000.00, 1, 'CCNA-2025-08-22'),
('CTDK012', 'PDK007', 'TS012', 3500000.00, 1, 'CCNA-2025-08-22'),
('CTDK013', 'PDK007', 'TS013', 3500000.00, 1, 'CCNA-2025-08-22'),
('CTDK014', 'PDK007', 'TS014', 3500000.00, 1, 'CCNA-2025-08-22'),
('CTDK015', 'PDK007', 'TS015', 3500000.00, 1, 'CCNA-2025-08-22'),

-- PDK008 - IC3
('CTDK016', 'PDK008', 'TS016', 1200000.00, 1, 'IC3-2025-08-25'),
('CTDK017', 'PDK008', 'TS017', 1200000.00, 1, 'IC3-2025-08-25'),
('CTDK018', 'PDK008', 'TS018', 1200000.00, 1, 'IC3-2025-08-25'),
('CTDK019', 'PDK008', 'TS019', 1200000.00, 1, 'IC3-2025-08-25'),
('CTDK020', 'PDK008', 'TS020', 1200000.00, 1, 'IC3-2025-08-25'),

-- PDK009 - IELTS (đợt cuối năm)
('CTDK021', 'PDK009', 'TS009', 4500000.00, 1, 'IELTS-2025-08-05'),
('CTDK022', 'PDK009', 'TS010', 4500000.00, 1, 'IELTS-2025-08-05'),
('CTDK023', 'PDK009', 'TS006', 4500000.00, 1, 'IELTS-2025-08-05'),

-- PDK010 - TOEIC (nhân viên kỹ thuật)
('CTDK024', 'PDK010', 'TS011', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK025', 'PDK010', 'TS012', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK026', 'PDK010', 'TS013', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK027', 'PDK010', 'TS014', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK028', 'PDK010', 'TS015', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK029', 'PDK010', 'TS003', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK030', 'PDK010', 'TS004', 1500000.00, 1, 'TOEIC-2025-08-10'),
('CTDK031', 'PDK010', 'TS005', 1500000.00, 1, 'TOEIC-2025-08-10');

-- Thêm dữ liệu cho các phiếu đăng ký từ PDK011 và PDK012
DECLARE @count INT = 32;
DECLARE @thiSinhId INT = 1;

-- Thêm chi tiết đăng ký cho PDK011 (12 thí sinh) - TOEFL
WHILE @thiSinhId <= 12
BEGIN
    INSERT INTO ChiTietDangKy (chiTietDangKyId, phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId)
    VALUES 
    ('CTDK' + RIGHT('000' + CAST(@count AS VARCHAR(3)), 3), 'PDK011', 
     'TS' + RIGHT('000' + CAST((@thiSinhId % 20 + 1) AS VARCHAR(3)), 3),  -- Sử dụng modulo để không vượt quá thí sinh đã tạo
     5000000.00, 1, 'TOEFL-2025-08-15');
    
    SET @count = @count + 1;
    SET @thiSinhId = @thiSinhId + 1;
END;

-- Thêm chi tiết đăng ký cho PDK012 (15 thí sinh) - MOS
SET @thiSinhId = 1;
WHILE @thiSinhId <= 15
BEGIN
    INSERT INTO ChiTietDangKy (chiTietDangKyId, phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId)
    VALUES 
    ('CTDK' + RIGHT('000' + CAST(@count AS VARCHAR(3)), 3), 'PDK012', 
     'TS' + RIGHT('000' + CAST((@thiSinhId % 20 + 1) AS VARCHAR(3)), 3),  -- Sử dụng modulo để không vượt quá thí sinh đã tạo
     1200000.00, 1, 'MOS-2025-08-20');
    
    SET @count = @count + 1;
    SET @thiSinhId = @thiSinhId + 1;
END;

-- Tạo thêm một số phiếu đăng ký cho lịch thi sắp tới (chưa thanh toán)
INSERT INTO PhieuDangKy (phieuDangKyId, ngayDangKy, daThanhToan, soLuongThiSinh, daDuyet, daHuy, thoiGianMongMuon, ghiChu, loaiChungChi, nhanVienId, khachHangId, loaiKiemTraId)
VALUES 
('PDK013', '2025-07-13', 0, 1, 1, 0, '2025-08-28 08:00:00', N'Đăng ký thi IELTS khóa mới', N'IELTS', 'NV001', 'KH005', 1),
('PDK014', '2025-07-14', 0, 10, 1, 0, '2025-08-30 13:30:00', N'Đăng ký thi TOEIC đợt 1/2025', N'TOEIC', 'NV002', 'KH002', 2);

-- Thêm chi tiết đăng ký cho PDK013 (IELTS khóa mới)
INSERT INTO ChiTietDangKy (chiTietDangKyId, phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId)
VALUES 
('CTDK059', 'PDK013', 'TS007', 4500000.00, 1, 'IELTS-2025-08-28'),
('CTDK060', 'PDK013', 'TS008', 4500000.00, 1, 'IELTS-2025-08-28'),
('CTDK061', 'PDK013', 'TS009', 4500000.00, 1, 'IELTS-2025-08-28');

-- Thêm chi tiết đăng ký cho PDK014 (TOEIC đợt 1/2024)
INSERT INTO ChiTietDangKy (chiTietDangKyId, phieuDangKyId, thiSinhId, giaLucDangKy, daChoXepLich, lichThiId)
VALUES 
('CTDK062', 'PDK014', 'TS003', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK063', 'PDK014', 'TS004', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK064', 'PDK014', 'TS005', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK065', 'PDK014', 'TS011', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK066', 'PDK014', 'TS012', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK067', 'PDK014', 'TS013', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK068', 'PDK014', 'TS014', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK069', 'PDK014', 'TS015', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK070', 'PDK014', 'TS016', 1500000.00, 1, 'TOEIC-2025-08-30'),
('CTDK071', 'PDK014', 'TS017', 1500000.00, 1, 'TOEIC-2025-08-30');
