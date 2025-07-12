// Service xử lý logic duyệt phiếu
import { YeuCauGiaHanRepository } from '../repositories/yeu-cau-gia-han.repository';

export class ApprovalService {
  private repo = new YeuCauGiaHanRepository();

  async getAllRequests() {
    return this.repo.getAll();
  }
  // Thêm các hàm duyệt, từ chối ...
} 