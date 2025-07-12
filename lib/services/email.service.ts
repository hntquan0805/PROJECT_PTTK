import nodemailer from "nodemailer"
import type { DisplayData } from "../models/phieu-dang-ky.model"

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

  async sendEmail(phieuTTId: string, data: DisplayData): Promise<void> {
    const emailContent = this.generateEmailContent(phieuTTId, data)

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await this.transporter.sendMail({
          from: process.env.SMTP_USER,
          to: data.email,
          subject: `Phiếu thanh toán - ${phieuTTId}`,
          html: emailContent,
        })
        console.log("Email sent successfully to:", data.email)
      } else {
        console.log("SMTP credentials not configured, email sending simulated")
      }
    } catch (error) {
      console.error("Email sending error:", error)
      throw new Error("Failed to send email")
    }
  }

  private generateEmailContent(phieuTTId: string, data: DisplayData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thông báo thanh toán - Mã hóa đơn: ${phieuTTId}</h2>
        <p>Kính gửi <strong>${data.customerName}</strong>,</p>
        
        <p>Chúng tôi đã tạo hóa đơn thanh toán cho đăng ký thi chứng chỉ của bạn.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Thông tin hóa đơn:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Mã hóa đơn:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${phieuTTId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Mã thanh toán:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Khách hàng:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chứng chỉ:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.certificate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Số tiền gốc:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.originalAmount.toLocaleString()} đ</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Giảm giá:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.discount}%</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Tổng thanh toán:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #2563eb; font-weight: bold;">${data.totalAmount.toLocaleString()} đ</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Hạn thanh toán:</strong></td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${data.paymentDeadline}</td>
            </tr>
          </table>
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
