import { NextResponse } from "next/server"
import { PhieuTTService } from "@/lib/services/phieu-thanh-toan.service"

const phieuTTService = new PhieuTTService()

export async function GET() {
  try {
    const troGiaOptions = await phieuTTService.getTroGiaOptions()
    return NextResponse.json(troGiaOptions)
  } catch (error) {
    console.error("API error fetching TroGia options:", error)
    return NextResponse.json({ error: "Failed to fetch TroGia options" }, { status: 500 })
  }
}
