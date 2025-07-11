// /app/api/schedule/route.ts
import { NextResponse } from "next/server";
import { ScheduleService } from "@/lib/services/ScheduleService";

export async function GET() {
  const service = new ScheduleService();
  const data = await service.getScheduleOptions();
  return NextResponse.json(data);
}
