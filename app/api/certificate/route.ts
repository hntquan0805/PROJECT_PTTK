import { NextResponse } from "next/server"
import { CertificateService } from "@/lib/services/certificate.service"

const certificateService = new CertificateService()

export async function GET(request: Request) {
  console.log(request.url)
  const { searchParams } = new URL(request.url)
  const maChungChi = searchParams.get("maChungChi")

  if (!maChungChi) {
    return NextResponse.json({ error: "Thiếu mã chứng chỉ" }, { status: 400 })
  }

  const data = await certificateService.getCertificateDetails(maChungChi)
  if (!data) {
    return NextResponse.json({ error: "Không tìm thấy chứng chỉ" }, { status: 404 })
  }

  return NextResponse.json(data)
}
