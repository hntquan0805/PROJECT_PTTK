"use client";
import { useEffect, useState } from "react";
import ApprovalList, { ApprovalRequest } from "./ApprovalList";
import ApprovalDetail from "./ApprovalDetail";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NextResponse } from "next/server";
import ScheduleOption from "@/lib/models/ScheduleOption";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";


export default function ExtensionRequestInterface() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [availableSchedules, setAvailableSchedules] = useState<ScheduleOption[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [decision, setDecision] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{ type: string; message: string }>({ type: "", message: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetch("/api/approval")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch(() => setRequests([]));
    fetch("/api/schedules")
      .then((res) => res.json())
      .then((data) => {
        // console.log("API schedules data:", data);
        setAvailableSchedules(data);
      })
      .catch(() => setAvailableSchedules([]));
  }, []);

  const filteredRequests = requests.filter(
    (request) =>
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRequest = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setDecision("");
    setRejectReason("");
    setSelectedSchedule("");
    setNotification({ type: "", message: "" });
    setOpen(true);
  };

  const handleConfirmDecision = async () => {
    setIsProcessing(true);
    if (!decision) {
      setNotification({ type: "error", message: "Vui lòng chọn phê duyệt hoặc từ chối yêu cầu." });
      setIsProcessing(false);
      return;
    }
    if (decision === "reject" && !rejectReason.trim()) {
      setNotification({ type: "error", message: "Vui lòng nhập lý do từ chối." });
      setIsProcessing(false);
      return;
    }
    if (decision === "approve" && !selectedSchedule) {
      setNotification({ type: "error", message: "Vui lòng chọn lịch thi mới." });
      setIsProcessing(false);
      return;
    }
    if (selectedRequest && selectedRequest.extensionCount >= 2) {
      setNotification({ type: "error", message: "Yêu cầu không hợp lệ! Khách hàng đã gia hạn tối đa 2 lần." });
      setIsProcessing(false);
      return;
    }
    try {
      const res = await fetch(`/api/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRequest?.id,
          decision,
          rejectReason,
          selectedSchedule,
        }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      setNotification({ type: "success", message: "Xử lý yêu cầu gia hạn thành công!" });
      // Reload lại danh sách
      fetch("/api/approval")
        .then((res) => res.json())
        .then((data) => setRequests(data));
      setSelectedRequest(null);
      setDecision("");
      setRejectReason("");
      setSelectedSchedule("");
      setOpen(false);
    } catch (error) {
      setNotification({ type: "error", message: "Hệ thống lỗi, vui lòng thử lại sau." });
    }
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Xử lý yêu cầu gia hạn</h1>
          <p className="text-muted-foreground">Xem xét và phê duyệt/từ chối yêu cầu gia hạn thời gian thi</p>
        </div>
      </div>
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" /> Tìm kiếm yêu cầu gia hạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Nhập mã yêu cầu, mã phiếu hoặc tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>
      {/* Danh sách yêu cầu gia hạn */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu gia hạn</CardTitle>
          <CardDescription>Hiển thị {filteredRequests.length} yêu cầu gia hạn</CardDescription>
        </CardHeader>
        <CardContent>
          <ApprovalList requests={filteredRequests} onSelect={handleSelectRequest} />
        </CardContent>
      </Card>
      {/* Dialog hiển thị form xử lý */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
            <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
            {selectedRequest && (
              <ApprovalDetail
                request={selectedRequest}
                schedules={availableSchedules}
                onDecision={handleConfirmDecision}
                notification={notification}
                isProcessing={isProcessing}
                decision={decision}
                setDecision={setDecision}
                rejectReason={rejectReason}
                setRejectReason={setRejectReason}
                selectedSchedule={selectedSchedule}
                setSelectedSchedule={setSelectedSchedule}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 