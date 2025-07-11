// API Route for ThanhToan - Updated to get pending payments only
import { NextResponse } from "next/server"
import { BillService } from "@/lib/services/bill.service"

const billService = new BillService()

export async function GET() {
  try {
    const thanhToans = await billService.getPendingThanhToan()
    return NextResponse.json(thanhToans)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch thanh toan" }, { status: 500 })
  }
}
