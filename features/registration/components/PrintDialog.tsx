"use client"

import type React from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Printer, Download, Eye } from "lucide-react"
import { toast } from "sonner"
import { PrintPreview } from "./PrintPreview"
import type { RegistrationInfoForm } from "../schemas"

interface PrintDialogProps {
  registrationInfo: RegistrationInfoForm
  registrationId: string
  createdDate: Date
  trigger?: React.ReactNode
}

export function PrintDialog({ registrationInfo, registrationId, createdDate, trigger }: PrintDialogProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (!printRef.current) return

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("Không thể mở cửa sổ in", {
        description: "Vui lòng cho phép popup và thử lại",
      })
      return
    }

    // Get the content to print
    const printContent = printRef.current.innerHTML

    // Create the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Phiếu đăng ký ${registrationId}</title>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              color: #000;
              background: white;
            }
            .print-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              background: white;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-3xl { font-size: 1.875rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mt-8 { margin-top: 2rem; }
            .mt-12 { margin-top: 3rem; }
            .p-3 { padding: 0.75rem; }
            .p-4 { padding: 1rem; }
            .p-6 { padding: 1.5rem; }
            .border { border: 1px solid #000; }
            .border-t { border-top: 1px solid #000; }
            .border-b-2 { border-bottom: 2px solid #000; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .gap-8 { gap: 2rem; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .space-y-3 > * + * { margin-top: 0.75rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .bg-yellow-50 { background-color: #fefce8; }
            .text-yellow-800 { color: #854d0e; }
            .text-yellow-700 { color: #a16207; }
            .text-blue-600 { color: #2563eb; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-500 { color: #6b7280; }
            .rounded-lg { border-radius: 0.5rem; }
            .w-16 { width: 4rem; }
            .h-16 { height: 4rem; }
            .gap-4 { gap: 1rem; }
            .gap-2 { gap: 0.5rem; }
            @media print {
              body { margin: 0; }
              .print-container { 
                max-width: none; 
                margin: 0; 
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent}
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
      printWindow.onafterprint = () => {
        printWindow.close()
        toast.success("In phiếu đăng ký thành công!", {
          description: "Phiếu đăng ký đã được in",
        })
      }
    }
  }

  const handleDownloadPDF = async () => {
    const loadingToast = toast.loading("Đang tạo PDF...", {
      description: "Vui lòng chờ trong giây lát",
    })

    try {
      // Use dynamic import to avoid SSR issues
      const { jsPDF } = await import("jspdf")
      const html2canvas = (await import("html2canvas")).default

      if (!printRef.current) return

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: printRef.current.scrollWidth,
        height: printRef.current.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`Phieu_dang_ky_${registrationId}.pdf`)

      toast.dismiss(loadingToast)
      toast.success("Tải PDF thành công!", {
        description: "File PDF đã được lưu",
      })
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Lỗi khi tạo PDF", {
        description: "Vui lòng thử lại sau",
      })
      console.error("Error generating PDF:", error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Xem và in phiếu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Phiếu đăng ký thi chứng chỉ
          </DialogTitle>
          <DialogDescription>Xem trước và in phiếu đăng ký. Mã phiếu: {registrationId}</DialogDescription>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 print:hidden">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            In phiếu
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Tải PDF
          </Button>
        </div>

        {/* Print Preview */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <PrintPreview
            ref={printRef}
            registrationInfo={registrationInfo}
            registrationId={registrationId}
            createdDate={createdDate}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
