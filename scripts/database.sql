-- Create the new database structure based on your requirements

-- Bảng: KhachHang
CREATE TABLE KhachHang (
    khachHangId NVARCHAR(50) PRIMARY KEY,
    hoTen NVARCHAR(100),
    email VARCHAR(100),
    diaChi NVARCHAR(255),
    soDienThoai VARCHAR(10),
    loaiKhachHang NVARCHAR(50) -- Tự do / Đơn vị
);

-- Bảng: NhanVien (referenced in other tables)
CREATE TABLE NhanVien (
    nhanVienId NVARCHAR(50) PRIMARY KEY,
    hoTen NVARCHAR(100),
    email VARCHAR(100),
    soDienThoai VARCHAR(10),
    chucVu NVARCHAR(50)
);

-- Bảng: TroGia (referenced in ThanhToan)
CREATE TABLE TroGia (
    troGiaId NVARCHAR(50) PRIMARY KEY,
    tenTroGia NVARCHAR(100),
    phanTramGiam DECIMAL(5,2),
    soTienGiam DECIMAL(10,2),
    dieuKien NVARCHAR(255)
);

-- Bảng: LichThi (referenced in ChiTietDangKy)
CREATE TABLE LichThi (
    lichThiId NVARCHAR(50) PRIMARY KEY,
    ngayThi DATE,
    gioBatDau TIME,
    gioKetThuc TIME,
    diaDiem NVARCHAR(255),
    soLuongToiDa INT
);

-- Bảng: PhieuGiaHan (referenced in ThanhToan)
CREATE TABLE PhieuGiaHan (
    phieuGiaHanId NVARCHAR(50) PRIMARY KEY,
    ngayGiaHan DATE,
    lyDoGiaHan NVARCHAR(255),
    trangThai NVARCHAR(50)
);

-- Bảng: ThiSinh
CREATE TABLE ThiSinh (
    thiSinhId NVARCHAR(50) PRIMARY KEY,
    hoTen NVARCHAR(100) NOT NULL,
    ngaySinh DATE,
    cccd VARCHAR(12),
    khachHangId NVARCHAR(50) FOREIGN KEY REFERENCES KhachHang(khachHangId)
);

-- Bảng: PhieuDangKy
CREATE TABLE PhieuDangKy (
    phieuDangKyId NVARCHAR(50) PRIMARY KEY,
    ngayDangKy DATE,
    daThanhToan BIT,
    soLuongThiSinh INT DEFAULT 1,
    daDuyet BIT, -- tinh trang phieu dang ky da duoc duyet hay chua
    daHuy BIT, -- tinh trang phieu dang ky co bi huy hay khong
    thoiGianMongMuon DATETIME,
    loaiChungChi NVARCHAR(255),
    ghiChu NVARCHAR(255),
    nhanVienId NVARCHAR(50) FOREIGN KEY REFERENCES NhanVien(nhanVienId),
    khachHangId NVARCHAR(50) FOREIGN KEY REFERENCES KhachHang(khachHangId)
);

-- Bảng: ChiTietDangKy
CREATE TABLE ChiTietDangKy (
    chiTietDangKyId INT PRIMARY KEY IDENTITY(1,1),
    phieuDangKyId NVARCHAR(50) FOREIGN KEY REFERENCES PhieuDangKy(phieuDangKyId),
    thiSinhId NVARCHAR(50) FOREIGN KEY REFERENCES ThiSinh(thiSinhId),
    giaLucDangKy DECIMAL(10,2),
    daChoXepLich BIT,
    lichThiId NVARCHAR(50) FOREIGN KEY REFERENCES LichThi(lichThiId)
);

-- Bảng: ThanhToan
CREATE TABLE ThanhToan (
    thanhToanId NVARCHAR(50) PRIMARY KEY,
    soTienBanDau DECIMAL(10,2),
    hanThanhToan DATETIME,
    soTienGiamGia DECIMAL(10,2),
    tongSoTien DECIMAL(10,2),
    loaiThanhToan NVARCHAR(50),
    trangThai NVARCHAR(50),
    troGiaId NVARCHAR(50) FOREIGN KEY REFERENCES TroGia(troGiaId),
    nhanVienId NVARCHAR(50) FOREIGN KEY REFERENCES NhanVien(nhanVienId),
    phieuDangKyId NVARCHAR(50) NULL FOREIGN KEY REFERENCES PhieuDangKy(phieuDangKyId),
    phieuGiaHanId NVARCHAR(50) NULL FOREIGN KEY REFERENCES PhieuGiaHan(phieuGiaHanId)
);

-- Bảng: HoaDon
CREATE TABLE HoaDon (
    hoaDonId INT PRIMARY KEY IDENTITY(1,1),
    ngayTao DATETIME DEFAULT GETDATE(),
    ngayThanhToan DATETIME,
    hinhThucThanhToan NVARCHAR(100),
    thanhToanId NVARCHAR(50) FOREIGN KEY REFERENCES ThanhToan(thanhToanId),
    trangThai NVARCHAR(50) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IX_HoaDon_ThanhToanId ON HoaDon(thanhToanId);
CREATE INDEX IX_HoaDon_TrangThai ON HoaDon(trangThai);
CREATE INDEX IX_HoaDon_NgayTao ON HoaDon(ngayTao);
CREATE INDEX IX_ThanhToan_HanThanhToan ON ThanhToan(hanThanhToan);
CREATE INDEX IX_PhieuDangKy_KhachHangId ON PhieuDangKy(khachHangId);
CREATE INDEX IX_PhieuDangKy_LoaiChungChi ON PhieuDangKy(loaiChungChi);
