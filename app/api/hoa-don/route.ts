// New API Route for HoaDon History
import { NextResponse } from "next/server"
import { PhieuTTService } from "@/lib/services/phieu-thanh-toan.service"

const phieuTTService = new PhieuTTService()

export async function GET() {
  try {
    const paidInvoices = await phieuTTService.getPaidInvoices()
    return NextResponse.json(paidInvoices)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch paid invoices" }, { status: 500 })
  }
}
