import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, User, Calendar, FileText } from "lucide-react";

export default function ApprovalDetail({
  request,
  schedules,
  onDecision,
  notification,
  isProcessing,
  decision,
  setDecision,
  rejectReason,
  setRejectReason,
  selectedSchedule,
  setSelectedSchedule,
}) {
  if (!request) return null;

  const getExtensionCountBadge = (count) => {
    if (count >= 2) {
      return <Badge variant="destructive">Đã hết lượt ({count}/2)</Badge>;
    } else if (count === 1) {
      return <Badge variant="secondary">Lần 2 ({count}/2)</Badge>;
    } else {
      return <Badge variant="outline">Lần 1 ({count}/2)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Thông tin khách hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" /> Thông tin khách hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tên khách hàng</Label>
              <p className="font-medium">{request.customerName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Loại khách hàng</Label>
              <p className="font-medium">{request.customerType}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
              <p className="font-medium">{request.phone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="font-medium">{request.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Thông tin yêu cầu gia hạn */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Thông tin yêu cầu gia hạn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Mã phiếu đăng ký</Label>
              <p className="font-medium">{request.ticketId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Môn thi</Label>
              <p className="font-medium">{request.examType}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Ngày thi hiện tại</Label>
              <p className="font-medium">{request.currentDate}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Ngày thi mong muốn</Label>
              <p className="font-medium">{request.requestedDate}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Lý do gia hạn</Label>
              <p className="font-medium">{request.reason}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Số lần gia hạn</Label>
              <div>{getExtensionCountBadge(request.extensionCount)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Trường hợp đặc biệt</Label>
              <p className="font-medium">{request.specialCase ? "Có (miễn phí)" : "Không (có phí)"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Giấy tờ minh chứng</Label>
              <div className="space-y-1">
                {request.documents.map((doc, index) => (
                  <Badge key={index} variant="outline" className="mr-1">
                    {doc}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Separator />
      {/* Form xử lý yêu cầu */}
      {request.status === "Chờ xử lý" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Xử lý yêu cầu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {request.extensionCount >= 2 && (
              <Alert className="border-red-500">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  Cảnh báo: Khách hàng đã gia hạn tối đa 2 lần. Không thể phê duyệt thêm.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Quyết định *</Label>
                <RadioGroup
                  value={decision}
                  onValueChange={setDecision}
                  className="mt-2"
                  disabled={request.extensionCount >= 2}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approve" id="approve" />
                    <Label htmlFor="approve" className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" /> Phê duyệt yêu cầu gia hạn
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reject" id="reject" />
                    <Label htmlFor="reject" className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" /> Từ chối yêu cầu gia hạn
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {decision === "approve" && (
                <div className="space-y-2">
                  <Label className="text-base font-medium">Chọn lịch thi mới *</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                    {schedules.map((schedule, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={`${schedule.date}-${schedule.time}`}
                          id={`schedule-${index}`}
                          checked={selectedSchedule === `${schedule.date}-${schedule.time}`}
                          onCheckedChange={() => setSelectedSchedule(`${schedule.date}-${schedule.time}`)}
                        />
                        <Label htmlFor={`schedule-${index}`} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span>
                              {schedule.date} - {schedule.time}
                            </span>
                            <Badge variant="outline">{schedule.slots} chỗ trống</Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {decision === "reject" && (
                <div className="space-y-2">
                  <Label htmlFor="rejectReason" className="text-base font-medium">
                    Lý do từ chối *
                  </Label>
                  <Textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối yêu cầu gia hạn..."
                    rows={3}
                  />
                </div>
              )}
              <Button
                onClick={onDecision}
                disabled={isProcessing || request.extensionCount >= 2}
                className="w-full"
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận quyết định"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Thông báo */}
      {notification.message && (
        <Alert className={notification.type === "error" ? "border-red-500" : "border-green-500"}>
          {notification.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription className={notification.type === "error" ? "text-red-700" : "text-green-700"}>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}
      {/* Trạng thái đã xử lý */}
      {request.status !== "Chờ xử lý" && (
        <Alert className={request.status === "Đã phê duyệt" ? "border-green-500" : "border-red-500"}>
          {request.status === "Đã phê duyệt" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription className={request.status === "Đã phê duyệt" ? "text-green-700" : "text-red-700"}>
            Yêu cầu gia hạn này đã được {request.status.toLowerCase()}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 