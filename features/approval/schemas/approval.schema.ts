// Định nghĩa schema validate dữ liệu duyệt phiếu (có thể dùng zod hoặc yup)
// Ví dụ với zod:
import { z } from 'zod';

export const approvalSchema = z.object({
  lyDo: z.string().min(1, 'Lý do không được để trống'),
  ngayYeuCau: z.string(),
  trangThai: z.string(),
  phieuDuThiId: z.number(),
  lichThiId: z.string(),
}); 