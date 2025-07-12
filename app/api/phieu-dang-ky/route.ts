// API Route for PhieuDangKy - Updated to get pending registrations
import { NextResponse } from "next/server"
import { PhieuTTService } from "@/lib/services/phieu-thanh-toan.service"

const phieuTTService = new PhieuTTService()

export async function GET() {
  try {
    const phieuDangKys = await phieuTTService.getPendingPhieuDangKy()
    return NextResponse.json(phieuDangKys)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch phieu dang ky" }, { status: 500 })
  }
}
