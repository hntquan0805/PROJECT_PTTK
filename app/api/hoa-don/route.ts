// New API Route for HoaDon History
import { type NextRequest, NextResponse } from "next/server"
import { BillService } from "@/lib/services/bill.service"

const billService = new BillService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (id) {
      const hoaDon = await billService.getHoaDonById(parseInt(id))
      if (!hoaDon) {
        return NextResponse.json({ error: "Không tìm thấy hóa đơn" }, { status: 404 })
      }
      return NextResponse.json(hoaDon)
    } else {
      const paidInvoices = await billService.getPaidInvoices()
      return NextResponse.json(paidInvoices)
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch paid invoices" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Missing hoaDonId parameter" }, { status: 400 })
    }
    
    await billService.deleteHoaDon(parseInt(id))
    return NextResponse.json({ success: true, message: "Đã xóa hóa đơn thành công" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ 
      error: "Xảy ra lỗi khi xóa hóa đơn",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { action, hoaDonId } = data
    
    if (!hoaDonId) {
      return NextResponse.json({ error: "Missing hoaDonId parameter" }, { status: 400 })
    }
    
    if (action === 'print') {
      const pdfPath = await billService.generateBillPDF(parseInt(hoaDonId))
      return NextResponse.json({ success: true, pdfPath })
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ 
      error: "Xảy ra lỗi khi xử lý yêu cầu",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
