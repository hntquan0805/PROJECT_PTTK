import { z } from "zod"

export const registrationInfoSchema = z.object({
  customerType: z.enum(["individual", "organization"]),
  registrantName: z.string().min(1, "Vui lòng nhập họ và tên"),
  registrantPhone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  registrantEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  examineeName: z.string().min(1, "Vui lòng nhập họ và tên thí sinh"),
  examineeId: z.string().min(9, "CCCD/CMND phải có ít nhất 9 số"),
  examineePhone: z.string().optional(),
  examineeEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  selectedSchedules: z
    .array(
      z.object({
        id: z.string(),
        date: z.string(),
        time: z.string(),
        type: z.enum(["english", "it"]),
        level: z.string(),
      }),
    )
    .min(1, "Vui lòng chọn ít nhất một lịch thi"),
})

export const createRegistrationSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, {
    message: "Vui lòng xác nhận thông tin",
  }),
  notes: z.string().optional(),
})

export type RegistrationInfoForm = z.infer<typeof registrationInfoSchema>
export type CreateRegistrationForm = z.infer<typeof createRegistrationSchema>
