// Presentation Layer - API Controller (updated for new structure)
import { type NextRequest, NextResponse } from "next/server"
import { PhieuTTService } from "@/lib/services/phieu-thanh-toan.service"
import type { DisplayData } from "@/lib/models/phieu-dang-ky.model"

const phieuTTService = new PhieuTTService()

export async function POST(request: NextRequest) {
  try {
    const _data = await request.json()
    const dData = _data.data

    // Map frontend data to service model
    const data: DisplayData = {
      id: dData.id,
      customerName: dData.customerName,
      email: dData.email,
      phone: dData.phone,
      certificate: dData.certificate,
      registrationDate: dData.registrationDate,
      dueDate: dData.dueDate,
      paymentDeadline: dData.paymentDeadline,
      originalAmount: dData.originalAmount,
      discount: dData.discount,
      totalAmount: dData.totalAmount,
      paymentMethod: dData.paymentMethod,
      paymentDate: dData.paymentDate,
      notes: dData.notes,
      status: "pending_billing",
      createdDate: dData.createdDate,
      troGiaId: dData.troGiaId || "",
    }

    const result = await phieuTTService.createAndSendPhieuTT(data)

    return NextResponse.json({
      success: true,
      phieuTTId: result.phieuTTId,
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
