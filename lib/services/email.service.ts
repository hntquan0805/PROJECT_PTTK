import nodemailer from "nodemailer"
import type { BillDisplayData } from "../models/thanh-toan.model"

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendBillEmail(hoaDonId: number, billData: BillDisplayData): Promise<void> {
    const emailContent = this.generateEmailContent(hoaDonId, billData)

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await this.transporter.sendMail({
          from: process.env.SMTP_USER,
          to: billData.email,
          subject: `Hóa đơn thanh toán - HD${hoaDonId}`,
          html: emailContent,
        })
        console.log("Email sent successfully to:", billData.email)
      } else {
        console.log("SMTP credentials not configured, email sending simulated")
      }
    } catch (error) {
      console.error("Email sending error:", error)
      throw new Error("Failed to send email")
    }
  }

  private generateEmailContent(hoaDonId: number, billData: BillDisplayData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thông báo thanh toán - Mã hóa đơn: HD${hoaDonId}</h2>
        <p>Kính gửi <strong>${billData.customerName}</strong>,</p>
        
        <p>Chúng tôi đã tạo hóa đơn thanh toán cho đăng ký thi chứng chỉ của bạn.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Thông tin hóa đơn:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Mã hóa đơn:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">HD${hoaDonId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Mã thanh toán:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${billData.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Khách hàng:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${billData.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chứng chỉ:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${billData.certificate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Số tiền gốc:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${billData.originalAmount.toLocaleString()} đ</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Giảm giá:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${billData.discount}%</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Tổng thanh toán:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #2563eb; font-weight: bold;">${billData.totalAmount.toLocaleString()} đ</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Hạn thanh toán:</strong></td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${billData.paymentDeadline}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #065f46;"><strong>Mã thanh toán:</strong> PAY-${billData.id}-2025</p>
        </div>
        
        <p>Vui lòng thực hiện thanh toán trước hạn để hoàn tất quá trình đăng ký thi chứng chỉ.</p>
        
        <p style="margin-top: 30px;">
          Trân trọng,<br>
          <strong>Ban Quản lý Chứng chỉ</strong>
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          Email này được gửi tự động. Vui lòng không trả lời email này.
        </p>
      </div>
    `
  }
}
