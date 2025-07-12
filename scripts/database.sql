-- Bảng: LoaiKiemTra
CREATE TABLE LoaiKiemTra (
    loaiKiemTraId INT PRIMARY KEY IDENTITY(1,1),
    tenKiemTra NVARCHAR(100),
    trangThai NVARCHAR(50),
    donViChamThi NVARCHAR(100),
    donViCapBang NVARCHAR(100),
    giaHienTai DECIMAL(10,2),
    conToChuc BIT
);

-- Bảng: LichThi
CREATE TABLE LichThi (
    lichThiId NVARCHAR(50)PRIMARY KEY  ,
    thoiGianThi TIME,
    ngayThi DATE,
    diaDiem NVARCHAR(255),
    soThiSinhToiDa INT,
    soThiSinhDaDangKy INT,
    loaiKiemTraId INT FOREIGN KEY REFERENCES LoaiKiemTra(loaiKiemTraId)
);

-- Bảng: NguoiDung
CREATE TABLE NguoiDung (
    nguoiDungId INT PRIMARY KEY ,
    username NVARCHAR(100) UNIQUE,
    password NVARCHAR(100),
    loaiNguoiDung NVARCHAR(50) -- ( admin , tài chính, tổ chức hành chính) 
);

-- Bảng: NhanVien
CREATE TABLE NhanVien (
    nhanVienId NVARCHAR(50) PRIMARY KEY ,
    hoTen NVARCHAR(100) NOT NULL,
    email VARCHAR(100),
    diaChi NVARCHAR(255),
    soDienThoai VARCHAR(10),
    loaiNhanVien NVARCHAR(50),
    trangThai NVARCHAR(50),
    nguoiDungId INT UNIQUE FOREIGN KEY REFERENCES NguoiDung(nguoiDungId)
);

-- Bảng: KhachHang
CREATE TABLE KhachHang (
    khachHangId NVARCHAR(50) PRIMARY KEY,
    hoTen NVARCHAR(100),
    email VARCHAR(100),
    diaChi NVARCHAR(255),
    soDienThoai VARCHAR(10),
    loaiKhachHang NVARCHAR(50), -- Tự do / Đơn vị
    );


-- Bảng: ThiSinh
CREATE TABLE ThiSinh (
    thiSinhId NVARCHAR(50) PRIMARY KEY,
    hoTen NVARCHAR(100) NOT NULL,
    ngaySinh DATE,
    cccd VARCHAR(12),
    khachHangId NVARCHAR(50) FOREIGN KEY REFERENCES KhachHang(khachHangId)
);

-- Bảng: TroGia
CREATE TABLE TroGia (
    troGiaId NVARCHAR(50) PRIMARY KEY ,
    tiLeGiamGia DECIMAL(5,2),
    moTaChinhSach NVARCHAR(255),
    soThiSinhToiThieu INT,
    truongHopMienPhiGiaHan NVARCHAR(100),
    doiTuong NVARCHAR(100),
    ngayBatDau DATE,
    ngayKetThuc DATE
);

-- Bảng: PhieuDangKy
CREATE TABLE PhieuDangKy (
    phieuDangKyId NVARCHAR(50) PRIMARY KEY,
    ngayDangKy DATE,
    daThanhToan BIT,
    soLuongThiSinh INT default 1,
    daDuyet Bit ,-- tinh trang phieu dang ky da duoc duyet hay chua
    daHuy Bit ,-- tinh trang phieu dang ky co bi huy hay khong
    thoiGianMongMuon DATETIME,
    ghiChu NVARCHAR(255),
    loaiChungChi NVARCHAR(50),
    nhanVienId NVARCHAR(50) FOREIGN KEY REFERENCES NhanVien(nhanVienId),
    khachHangId NVARCHAR(50) FOREIGN KEY REFERENCES KhachHang(khachHangId)
);
CREATE TABLE ChiTietDangKy (
    chiTietDangKyId NVARCHAR(50) PRIMARY KEY ,
    phieuDangKyId NVARCHAR(50) FOREIGN KEY REFERENCES PhieuDangKy(phieuDangKyId),
    thiSinhId NVARCHAR(50) FOREIGN KEY REFERENCES ThiSinh(thiSinhId),
    giaLucDangKy DECIMAL(10,2),
    daChoXepLich BIT,
    lichThiId NVARCHAR(50) FOREIGN KEY REFERENCES LichThi(lichThiId)
);

-- Bảng: PhongThi
CREATE TABLE PhongThi (
    phongId INT PRIMARY KEY IDENTITY(1,1),
    tenPhong NVARCHAR(100),
    diaDiemPhong NVARCHAR(255),
    conSuDung BIT
);

-- Bảng: PhieuDuThi
CREATE TABLE PhieuDuThi (
    phieuDuThiId INT PRIMARY KEY IDENTITY(1,1),
    soBaoDanh NVARCHAR(50),
    ngayPhatHanh DATE,
    daGuiEmailThongBao BIT,
    trangThai NVARCHAR(50),
    soLanGiaHan int DEFAULT 0,
    chiTietDangKyId NVARCHAR(50) FOREIGN KEY REFERENCES ChiTietDangKy(chiTietDangKyId),
    nhanVienId NVARCHAR(50) FOREIGN KEY REFERENCES NhanVien(nhanVienId),
    phongId INT FOREIGN KEY REFERENCES PhongThi(phongId)
);
create table YeuCauGiaHan (
    yeuCauGiaHanId INT PRIMARY KEY IDENTITY(1,1),
    lyDo NVARCHAR(255),
    ngayYeuCau DATE,
    trangThai NVARCHAR(50),
    phieuDuThiId INT FOREIGN KEY REFERENCES PhieuDuThi(phieuDuThiId),
    lichThiId NVARCHAR(50) FOREIGN KEY REFERENCES LichThi(lichThiId)
);
-- Bảng: PhieuGiaHan
CREATE TABLE PhieuGiaHan (
    phieuGiaHanId NVARCHAR(50) PRIMARY KEY ,
    phiGiaHan DECIMAL(10,2),
    daThanhToan BIT,
    ngayThiCu DATE,
    ngayThiMoi DATE,
    phieuDuThiId INT FOREIGN KEY REFERENCES PhieuDuThi(phieuDuThiId),
    nhanVienId NVARCHAR(50) FOREIGN KEY REFERENCES NhanVien(nhanVienId)
);

-- --Bảng: HoaDon
-- CREATE TABLE HoaDon (
--     hoaDonId NVARCHAR(50) PRIMARY KEY IDENTITY(1,1),
--     soTienBanDau DECIMAL(10,2),
--     hanThanhToan DATETIME,
--     soTienGiamGia DECIMAL(10,2),
--     tongSoTien DECIMAL(10,2),
--     trangThai NVARCHAR(50),
--     troGiaId NVARCHAR(50) FOREIGN KEY REFERENCES TroGia(troGiaId),
--     nhanVienId NVARCHAR(50) FOREIGN KEY REFERENCES NhanVien(nhanVienId),
--     phieuDangKyId NVARCHAR(50) NULL  FOREIGN KEY REFERENCES PhieuDangKy(phieuDangKyId),
--     phieuGiaHanId NVARCHAR(50) NULL  FOREIGN KEY REFERENCES PhieuGiaHan(phieuGiaHanId)
--  );
-- -- bảng ThanhToan
-- CREATE TABLE ThanhToan (
--     thanhToanId NVARCHAR(50) PRIMARY KEY IDENTITY(1,1),
--     ngayTao DATETIME DEFAULT GETDATE(),
--     ngayThanhToan DATETIME,
--     hinhThucThanhToan NVARCHAR(100),
--     trangThai NVARCHAR(50) NOT NULL ,
--     HoaDon	NVARCHAR(50) FOREIGN KEY REFERENCES HoaDon(thanhToanId)
--     );
--Bảng: ThanhToan
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
     phieuDangKyId NVARCHAR(50) NULL  FOREIGN KEY REFERENCES PhieuDangKy(phieuDangKyId),
     phieuGiaHanId NVARCHAR(50) NULL  FOREIGN KEY REFERENCES PhieuGiaHan(phieuGiaHanId)
 );
-- bảng hoá đơn 
CREATE TABLE HoaDon (
    hoaDonId INT PRIMARY KEY IDENTITY(1,1),
    ngayTao DATETIME DEFAULT GETDATE(),
    ngayThanhToan DATETIME,
    hinhThucThanhToan NVARCHAR(100),
    thanhToanId	NVARCHAR(50) FOREIGN KEY REFERENCES ThanhToan(thanhToanId),
    trangThai NVARCHAR(50) NOT NULL 
    );
-- Bảng: ChungChi
CREATE TABLE ChungChi (
    chungChiId INT PRIMARY KEY IDENTITY(1,1),
    tenChungChi NVARCHAR(100),
    maSochungChi NVARCHAR(50) ,
    loaiChungChi NVARCHAR(100),
    xepLoai NVARCHAR(50),
    daNhanBang BIT,
    Ngaycap DATE,
    hinhThucNhan NVARCHAR(50)
);


-- Bảng: KetQuaThi
CREATE TABLE KetQuaThi (
    ketQuaThiId INT PRIMARY KEY IDENTITY(1,1),
    diemThi DECIMAL(4,2),
    ngayCongBoKetQua DATE,
    daGuiEmail BIT,
    phieuDuThiId INT FOREIGN KEY REFERENCES PhieuDuThi(phieuDuThiId),
    chungChiId INT FOREIGN KEY REFERENCES ChungChi(chungChiId)
);
CREATE TABLE GiamThi (
    giamThiId INT PRIMARY KEY IDENTITY(1,1),    
    lichThiId NVARCHAR(50) FOREIGN key REFERENCES LichThi(lichThiId),
    nhanVienId NVARCHAR(50) FOREIGN KEY REFERENCES NhanVien(nhanVienId)
);


-- Thêm trường loaiKiemTraId vào bảng PhieuDangKy
ALTER TABLE PhieuDangKy
ADD loaiKiemTraId INT FOREIGN KEY REFERENCES LoaiKiemTra(loaiKiemTraId);

GO
-- Tạo stored procedure để tính toán giá thanh toán cho phiếu đăng ký
CREATE PROCEDURE CalculatePaymentForRegistration
    @phieuDangKyId NVARCHAR(50)
AS
BEGIN
    DECLARE @soLuongThiSinh INT;
    DECLARE @giaHienTai DECIMAL(10,2);
    DECLARE @soTienBanDau DECIMAL(10,2);
    DECLARE @tiLeGiamGia DECIMAL(5,2) = 0;
    DECLARE @soTienGiamGia DECIMAL(10,2) = 0;
    DECLARE @tongSoTien DECIMAL(10,2);
    DECLARE @troGiaId NVARCHAR(50) = NULL;
    DECLARE @nhanVienId NVARCHAR(50);
    DECLARE @loaiKhachHang NVARCHAR(50);

    -- Lấy thông tin từ phiếu đăng ký
    SELECT 
        @soLuongThiSinh = pdk.soLuongThiSinh,
        @giaHienTai = lkt.giaHienTai,
        @nhanVienId = pdk.nhanVienId,
        @loaiKhachHang = kh.loaiKhachHang
    FROM PhieuDangKy pdk
    INNER JOIN LoaiKiemTra lkt ON pdk.loaiKiemTraId = lkt.loaiKiemTraId
    INNER JOIN KhachHang kh ON pdk.khachHangId = kh.khachHangId
    WHERE pdk.phieuDangKyId = @phieuDangKyId;

    -- Tính tổng số tiền ban đầu
    SET @soTienBanDau = @soLuongThiSinh * @giaHienTai;

    -- Tìm trợ giá phù hợp dựa trên số lượng thí sinh và loại khách hàng
    SELECT TOP 1 
        @tiLeGiamGia = tiLeGiamGia,
        @troGiaId = troGiaId
    FROM TroGia
    WHERE (@soLuongThiSinh >= soThiSinhToiThieu)
      AND (doiTuong = @loaiKhachHang OR doiTuong IS NULL)
      AND (ngayBatDau <= GETDATE() AND (ngayKetThuc >= GETDATE() OR ngayKetThuc IS NULL))
    ORDER BY tiLeGiamGia DESC;

    -- Tính số tiền giảm giá
    SET @soTienGiamGia = @soTienBanDau * (@tiLeGiamGia / 100);

    -- Tính tổng số tiền sau giảm giá
    SET @tongSoTien = @soTienBanDau - @soTienGiamGia;

    -- Tạo thanh toán mới với ID duy nhất cho mỗi phiếu đăng ký
    DECLARE @thanhToanId NVARCHAR(50) = 'TT' + @phieuDangKyId + CAST(DATEDIFF(SECOND, '2000-01-01', GETDATE()) AS NVARCHAR(50));
    
    -- Kiểm tra xem phiếu đăng ký này đã có thanh toán chưa
    IF NOT EXISTS (SELECT 1 FROM ThanhToan WHERE phieuDangKyId = @phieuDangKyId)
    BEGIN
        INSERT INTO ThanhToan (
            thanhToanId, 
            soTienBanDau, 
            hanThanhToan, 
            soTienGiamGia, 
            tongSoTien, 
            loaiThanhToan, 
            trangThai, 
            troGiaId, 
            nhanVienId, 
            phieuDangKyId, 
            phieuGiaHanId
        )
        VALUES (
            @thanhToanId,
            @soTienBanDau,
            DATEADD(DAY, 7, GETDATE()),
            @soTienGiamGia,
            @tongSoTien,
            N'Chuyển khoản',
            N'Chưa lập hóa đơn',
            @troGiaId,
            @nhanVienId,
            @phieuDangKyId,
            NULL
        );

        -- Trả về thông tin thanh toán
        SELECT 
            thanhToanId,
            soTienBanDau,
            hanThanhToan,
            soTienGiamGia,
            tongSoTien,
            loaiThanhToan,
            trangThai,
            troGiaId
        FROM ThanhToan
        WHERE thanhToanId = @thanhToanId;
    END
END