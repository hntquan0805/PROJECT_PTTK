// API Route for PhieuDangKy - Updated to get pending registrations
import { NextResponse } from "next/server"
import { BillService } from "@/lib/services/bill.service"

const billService = new BillService()

export async function GET() {
  try {
    const phieuDangKys = await billService.getPendingPhieuDangKy()
    return NextResponse.json(phieuDangKys)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch phieu dang ky" }, { status: 500 })
  }
}
