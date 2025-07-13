import { type NextRequest, NextResponse } from "next/server"
import { ThanhToanRepository } from "@/lib/repositories/thanh-toan.repository"
import { HoaDonRepository } from "@/lib/repositories/hoa-don.repository"
import { PhieuDangKyRepository } from "@/lib/repositories/phieu-dang-ky.repository"
import { EmailService } from "@/lib/services/email.service"
import type { BillDisplayData, ThanhToan } from "@/lib/models/thanh-toan.model"

const thanhToanRepo = new ThanhToanRepository()
const hoaDonRepo = new HoaDonRepository()
const phieuDangKyRepo = new PhieuDangKyRepository()
const emailService = new EmailService()

// Hàm hỗ trợ chuyển đổi ngày tháng an toàn
function toValidISOString(dateInput: string | undefined): string {
  try {
    if (!dateInput) {
      return new Date().toISOString();
    }
    
    // Xử lý định dạng "dd/mm/yyyy" của Việt Nam
    if (dateInput.includes("/")) {
      const parts = dateInput.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Tháng trong JS bắt đầu từ 0
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
    }
    
    // Thử chuyển đổi trực tiếp
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    
    // Mặc định nếu không chuyển đổi được
    return new Date().toISOString();
  } catch (error) {
    console.error("Date conversion error:", error);
    return new Date().toISOString();
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { billData, isIndividual } = data

    // Lấy thông tin phiếu đăng ký
    const phieuDangKyId = billData.id  // ID phiếu đăng ký, không phải thanh toán
    const phieuDangKy = await phieuDangKyRepo.findById(phieuDangKyId)

    if (!phieuDangKy) {
      throw new Error("Không tìm thấy phiếu đăng ký")
    }

    const ngayTao = new Date().toISOString()
    const ngayThanhToan = billData.paymentDate ? toValidISOString(billData.paymentDate) : undefined

    // 1. Tạo ThanhToan mới
    const thanhToanData = {
      soTienBanDau: billData.originalAmount,
      hanThanhToan: toValidISOString(billData.paymentDeadline),
      soTienGiamGia: isIndividual ? 0 : (billData.originalAmount - billData.totalAmount),
      tongSoTien: billData.totalAmount,
      loaiThanhToan: billData.paymentMethod,
      trangThai: "Đã lập hóa đơn",
      troGiaId: undefined,  // Khách hàng cá nhân không có trợ giá
      nhanVienId: undefined,  // Không biết thông tin nhân viên
      phieuDangKyId: phieuDangKyId,
      phieuGiaHanId: undefined,
      dueDate: toValidISOString(billData.dueDate)
    }

    // Tạo thanh toán mới
    const thanhToanId = await thanhToanRepo.create(thanhToanData)

    // 2. Tạo HoaDon mới liên kết đến ThanhToan vừa tạo
    const hoaDonRequest = {
      ngayTao,
      ngayThanhToan,
      hinhThucThanhToan: billData.paymentMethod,
      thanhToanId,
      trangThai: ngayThanhToan ? "Đã thanh toán" : "Chờ thanh toán"
    }

    const hoaDonId = await hoaDonRepo.create(hoaDonRequest)

    // Nếu đã thanh toán, cập nhật trạng thái phiếu đăng ký
    if (ngayThanhToan) {
      await phieuDangKyRepo.updatePaymentStatus(phieuDangKyId, true)
    }

    // Gửi email xác nhận hóa đơn (optional)
    const billDisplayData: BillDisplayData = {
      id: thanhToanId,  // Sử dụng ID thanh toán mới
      customerName: billData.customerName,
      email: billData.email,
      phone: billData.phone,
      certificate: billData.certificate,
      registrationDate: billData.registrationDate,
      dueDate: billData.dueDate,
      paymentDeadline: billData.paymentDeadline,
      originalAmount: billData.originalAmount,
      discount: isIndividual ? 0 : ((billData.discount || 0)),
      totalAmount: billData.totalAmount,
      paymentMethod: billData.paymentMethod,
      paymentDate: billData.paymentDate,
      notes: billData.notes,
      status: ngayThanhToan ? "paid" : "pending",
      createdDate: ngayTao
    }

    try {
      await emailService.sendBillEmail(hoaDonId, billDisplayData)
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Tiếp tục xử lý vì lỗi gửi email không ảnh hưởng đến việc lưu hóa đơn
    }

    return NextResponse.json({
      success: true,
      hoaDonId,
      thanhToanId,
      message: "Hóa đơn đã được tạo thành công!"
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Xảy ra lỗi khi xử lý hóa đơn",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (id) {
      const thanhToan = await thanhToanRepo.findById(id)
      return NextResponse.json(thanhToan)
    } else {
      const allThanhToan = await thanhToanRepo.findAll()
      return NextResponse.json(allThanhToan)
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { 
        error: "Xảy ra lỗi khi lấy thông tin thanh toán",
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
