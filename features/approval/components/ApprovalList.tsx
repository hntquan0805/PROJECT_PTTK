import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";

export interface ApprovalRequest {
  id: string;
  ticketId: string;
  customerName: string;
  customerType: string;
  phone: string;
  email: string;
  examType: string;
  currentDate: string;
  requestedDate: string;
  reason: string;
  extensionCount: number;
  status: string;
  requestDate: string;
  documents: string[];
  specialCase: boolean;
}

interface ApprovalListProps {
  requests: ApprovalRequest[];
  onSelect: (request: ApprovalRequest) => void;
}

export default function ApprovalList({ requests, onSelect }: ApprovalListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Chờ xử lý":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Clock className="w-3 h-3 mr-1" />
            Chờ xử lý
          </Badge>
        );
      case "Đã phê duyệt":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã phê duyệt
          </Badge>
        );
      case "Đã từ chối":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExtensionCountBadge = (count: number) => {
    if (count >= 2) {
      return <Badge variant="destructive">Đã hết lượt ({count}/2)</Badge>;
    } else if (count === 1) {
      return <Badge variant="secondary">Lần 2 ({count}/2)</Badge>;
    } else {
      return <Badge variant="outline">Lần 1 ({count}/2)</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã YC</TableHead>
          <TableHead>Mã phiếu</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Lý do</TableHead>
          <TableHead>Số lần GH</TableHead>
          <TableHead>Ngày YC</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.id}</TableCell>
            <TableCell>{request.ticketId}</TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{request.customerName}</p>
                <p className="text-sm text-muted-foreground">{request.customerType}</p>
              </div>
            </TableCell>
            <TableCell>{request.reason}</TableCell>
            <TableCell>{getExtensionCountBadge(request.extensionCount)}</TableCell>
            <TableCell>{request.requestDate}</TableCell>
            <TableCell>{getStatusBadge(request.status)}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect(request)}
                disabled={request.status !== "Chờ xử lý"}
              >
                <Eye className="w-4 h-4 mr-1" />
                {request.status === "Chờ xử lý" ? "Xử lý" : "Xem"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 