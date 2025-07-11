// app/api/registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ScheduleService } from "@/lib/services/ScheduleService";
import { registrationInfoSchema } from "@/features/registration/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[REGISTRATION_REQUEST 2222]", req);
    console.log("[REGISTRATION_REQUEST]", body);
    const data = registrationInfoSchema.parse(body);

    const service = new ScheduleService();
    const result = await service.register(data);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[REGISTRATION_ERROR]", error);
    return NextResponse.json({ error: "Lỗi đăng ký" }, { status: 500 });
  }
}
