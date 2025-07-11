// Presentation Layer - API Controller (updated for new structure)
import { type NextRequest, NextResponse } from "next/server"
import { BillService } from "@/lib/services/bill.service"
import type { BillDisplayData } from "@/lib/models/thanh-toan.model"

const billService = new BillService()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const billData = data.billData

    // Map frontend data to service model
    const billDisplayData: BillDisplayData = {
      id: billData.id,
      customerName: billData.customerName,
      email: billData.email,
      phone: billData.phone,
      certificate: billData.certificate,
      registrationDate: billData.registrationDate,
      dueDate: billData.dueDate,
      paymentDeadline: billData.paymentDeadline,
      originalAmount: billData.originalAmount,
      discount: billData.discount,
      totalAmount: billData.totalAmount,
      paymentMethod: billData.paymentMethod,
      paymentDate: billData.paymentDate,
      notes: billData.notes,
      status: "pending",
      createdDate: billData.createdDate,
    }

    const result = await billService.createAndSendHoaDon(billDisplayData)

    return NextResponse.json({
      success: true,
      hoaDonId: result.hoaDonId,
      message: result.message,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
