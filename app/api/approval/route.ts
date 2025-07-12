import { NextResponse } from "next/server";
import { ApprovalService } from "@/lib/services/approval.service";
import type { NextRequest } from "next/server";

export async function GET() {
  const service = new ApprovalService();
  const data = await service.getAllRequests();
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, decision, rejectReason, selectedSchedule } = body;
  const service = new ApprovalService();
  if (decision === "approve") {
    return NextResponse.json(await service.approveRequest(id, selectedSchedule));
  } else if (decision === "reject") {
    return NextResponse.json(await service.rejectRequest(id, rejectReason));
  }
  return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
} 