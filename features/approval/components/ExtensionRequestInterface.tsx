"use client";
import { useEffect, useState } from "react";
import ApprovalList from "./ApprovalList";
import ApprovalDetail from "./ApprovalDetail";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ExtensionRequestInterface() {
  const [requests, setRequests] = useState([]);
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [decision, setDecision] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch("/api/approval")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch(() => setRequests([]));
    fetch("/api/lich-thi")
      .then((res) => res.json())
      .then((data) => setAvailableSchedules(data))
      .catch(() => setAvailableSchedules([]));
  }, []);

  const filteredRequests = requests.filter(
    (request) =>
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setDecision("");
    setRejectReason("");
    setSelectedSchedule("");
    setNotification({ type: "", message: "" });
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
    if (selectedRequest.extensionCount >= 2) {
      setNotification({ type: "error", message: "Yêu cầu không hợp lệ! Khách hàng đã gia hạn tối đa 2 lần." });
      setIsProcessing(false);
      return;
    }
    try {
      const res = await fetch(`/api/approval/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
      {/* Chi tiết yêu cầu và xử lý */}
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
  );
} 