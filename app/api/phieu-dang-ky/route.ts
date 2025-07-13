// API Route for PhieuDangKy - Updated to get pending registrations
import { NextResponse } from "next/server"
import { PhieuDangKyRepository } from "@/lib/repositories/phieu-dang-ky.repository"

const phieuDangKyRepo = new PhieuDangKyRepository()

export async function GET() {
  try {
    // Lấy các phiếu đăng ký chưa thanh toán
    const phieuDangKys = await phieuDangKyRepo.findPending()
    return NextResponse.json(phieuDangKys)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch phieu dang ky",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 