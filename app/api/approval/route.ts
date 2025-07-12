// API route cho duyệt phiếu
import { NextRequest, NextResponse } from 'next/server';
import { ApprovalService } from '../../../lib/services/approval.service';

const service = new ApprovalService();

export async function GET() {
  const data = await service.getAllRequests();
  return NextResponse.json(data);
}
// Thêm các method POST, PUT, PATCH nếu cần 