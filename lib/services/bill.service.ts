// Business Logic Layer - Updated Bill Service
import { ThanhToanRepository } from "../repositories/thanh-toan.repository"
import { HoaDonRepository } from "../repositories/hoa-don.repository"
import { EmailService } from "./email.service"
import type { ThanhToan, BillDisplayData, CreateHoaDonRequest, HoaDonWithDetails } from "../models/thanh-toan.model"

export class BillService {
  private thanhToanRepo: ThanhToanRepository
  private hoaDonRepo: HoaDonRepository
  private emailService: EmailService

  constructor() {
    this.thanhToanRepo = new ThanhToanRepository()
    this.hoaDonRepo = new HoaDonRepository()
    this.emailService = new EmailService()
  }

  async getPendingThanhToan(): Promise<ThanhToan[]> {
    try {
      return await this.thanhToanRepo.findByStatus("Chưa lập hóa đơn")
    } catch (error) {
      console.error("Service error getting pending thanh toan:", error)
      throw new Error("Failed to retrieve pending thanh toan")
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

  async getAllThanhToan(): Promise<ThanhToan[]> {
    try {
      return await this.thanhToanRepo.findAll()
    } catch (error) {
      console.error("Service error getting thanh toan:", error)
      throw new Error("Failed to retrieve thanh toan")
    }
  }

  async getThanhToanById(id: string): Promise<ThanhToan | null> {
    try {
      return await this.thanhToanRepo.findById(id)
    } catch (error) {
      console.error("Service error getting thanh toan:", error)
      throw new Error("Failed to retrieve thanh toan")
    }
  }

  async createAndSendHoaDon(billData: BillDisplayData): Promise<{ hoaDonId: number; message: string }> {
    try {
      // Business Logic: Validate bill data
      this.validateBillData(billData)

      // Check if HoaDon already exists for this ThanhToan
      const existingHoaDon = await this.hoaDonRepo.findByThanhToanId(billData.id)
      
      if (existingHoaDon) {
        throw new Error("Hóa đơn đã tồn tại cho thanh toán này")
      }

      // Create hoa don in database
      const createHoaDonRequest: CreateHoaDonRequest = {
        ngayTao: new Date().toISOString(),
        ngayThanhToan: billData.paymentDate ? new Date(billData.paymentDate).toISOString() : undefined,
        hinhThucThanhToan: billData.paymentMethod,
        thanhToanId: billData.id,
        trangThai: billData.paymentDate ? "Đã thanh toán" : "Đã gửi",
      }

      const hoaDonId = await this.hoaDonRepo.create(createHoaDonRequest)

      // Update ThanhToan status to "Đã lập hóa đơn"
      await this.thanhToanRepo.updateStatus(billData.id, "Đã lập hóa đơn")

      // Send email
      await this.emailService.sendBillEmail(hoaDonId, billData)

      return {
        hoaDonId,
        message: "Hóa đơn đã được tạo và email đã được gửi thành công!",
      }
    } catch (error) {
      console.error("Service error creating hoa don:", error)
      throw new Error("Failed to create and send hoa don")
    }
  }

  async markHoaDonAsPaid(hoaDonId: number, paymentDate?: string): Promise<void> {
    try {
      const ngayThanhToan = paymentDate || new Date().toISOString()
      await this.hoaDonRepo.updatePaymentDate(hoaDonId, ngayThanhToan)
    } catch (error) {
      console.error("Service error marking hoa don as paid:", error)
      throw new Error("Failed to mark hoa don as paid")
    }
  }

  private validateBillData(billData: BillDisplayData): void {
    if (!billData.id) {
      throw new Error("Thanh toan ID is required")
    }
    if (!billData.customerName) {
      throw new Error("Customer name is required")
    }
    if (!billData.email) {
      throw new Error("Email is required")
    }
    if (!this.isValidEmail(billData.email)) {
      throw new Error("Invalid email format")
    }
    if (billData.originalAmount <= 0) {
      throw new Error("Original amount must be greater than 0")
    }
    if (!billData.paymentMethod) {
      throw new Error("Payment method is required")
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async filterThanhToan(
    thanhToans: ThanhToan[],
    searchTerm: string,
  ): Promise<{
    pending: ThanhToan[]
    paid: ThanhToan[]
  }> {
    const filtered = thanhToans.filter((tt) => tt.thanhToanId.toLowerCase().includes(searchTerm.toLowerCase()))

    return {
      pending: filtered.filter((tt) => tt.status === "pending" || tt.status === "overdue"),
      paid: filtered.filter((tt) => tt.status === "paid"),
    }
  }
}
