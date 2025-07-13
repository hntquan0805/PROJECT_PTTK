// Business Logic Layer - Updated Bill Service
import { ThanhToanRepository } from "../repositories/thanh-toan.repository"
import { HoaDonRepository } from "../repositories/hoa-don.repository"
import { PhieuDangKyRepository } from "../repositories/phieu-dang-ky.repository"
import { TroGiaRepository } from "../repositories/tro-gia.repository"
import { EmailService } from "./email.service"
import type { ThanhToan, CreatePhieuTTRequest } from "../models/phieu-thanh-toan.model"
import type { HoaDonWithDetails } from "../models/hoa-don.model"
import type { DisplayData } from "../models/phieu-dang-ky.model"
import type { PhieuDangKy } from "../models/phieu-dang-ky.model"
import type { TroGia } from "../models/tro-gia.model"

export class PhieuTTService {
  private thanhToanRepo: ThanhToanRepository
  private hoaDonRepo: HoaDonRepository
  private phieuDangKyRepo: PhieuDangKyRepository
  private emailService: EmailService
  private troGiaRepo: TroGiaRepository

  constructor() {
    this.thanhToanRepo = new ThanhToanRepository()
    this.hoaDonRepo = new HoaDonRepository()
    this.phieuDangKyRepo = new PhieuDangKyRepository()
    this.emailService = new EmailService()
    this.troGiaRepo = new TroGiaRepository()
  }

  async getPendingPhieuDangKy(): Promise<PhieuDangKy[]> {
    try {
      return await this.phieuDangKyRepo.findPending()
    } catch (error) {
      console.error("Service error getting pending phieu dang ky:", error)
      throw new Error("Failed to retrieve pending phieu dang ky")
    }
  }

  async getPaidInvoices(): Promise<HoaDonWithDetails[]> {
    try {
      return await this.hoaDonRepo.findPaidInvoices()
    } catch (error) {
      console.error("Service error getting paid invoices:", error)
      throw new Error("Failed to retrieve paid invoices")
    }
  }

  async getTroGiaOptions(): Promise<TroGia[]> {
    try {
      return await this.troGiaRepo.findAll()
    } catch (error) {
      console.error("Service error getting TroGia options:", error)
      throw new Error("Failed to retrieve TroGia options")
    }
  }

  async createAndSendPhieuTT(data: DisplayData): Promise<{ phieuTTId: string; message: string }> {
    try {
      this.validateData(data)

      const existingPTT = await this.thanhToanRepo.findByPhieuDKId(data.id)
      
      if (existingPTT) {
        throw new Error("Phiếu thanh toán đã toan tại cho phiếu đăng ký này.")
      }

      const createPhieuTTRequest: CreatePhieuTTRequest = {
        soTienBanDau: data.originalAmount,
        hanThanhToan: data.paymentDeadline,
        soTienGiamGia: data.discount, 
        tongSoTien: data.totalAmount,
        loaiThanhToan: data.paymentMethod,
        trangThai: data.status,
        troGiaId: data.troGiaId,
        nhanVienId: "NV001",
        phieuDangKyId: data.id,
        phieuGiaHanId: ""
      }

      const phieuTTId = await this.thanhToanRepo.create(createPhieuTTRequest)

      await this.phieuDangKyRepo.updatePaymentStatus(data.id, true)

      await this.emailService.sendEmail(phieuTTId, data)

      return {
        phieuTTId,
        message: "Email đã được gửi thành công!",
      }
    } catch (error) {
      console.error("Service error creating phieu thanh toan:", error)
      throw new Error("Failed to create and send phieu thanh toan")
    }
  }

  private validateData(data: DisplayData): void {
    if (!data.id) {
      throw new Error("Phieu Dang Ky ID is required")
    }
    if (!data.customerName) {
      throw new Error("Customer name is required")
    }
    if (!data.email) {
      throw new Error("Email is required")
    }
    if (!this.isValidEmail(data.email)) {
      throw new Error("Invalid email format")
    }
    if (data.originalAmount <= 0) {
      throw new Error("Original amount must be greater than 0")
    }
    if (!data.paymentMethod) {
      throw new Error("Payment method is required")
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
