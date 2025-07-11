// New API Route for HoaDon History
import { NextResponse } from "next/server"
import { BillService } from "@/lib/services/bill.service"

const billService = new BillService()

export async function GET() {
  try {
    const paidInvoices = await billService.getPaidInvoices()
    return NextResponse.json(paidInvoices)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch paid invoices" }, { status: 500 })
  }
}
