// Service xử lý logic duyệt phiếu
import { YeuCauGiaHanRepository } from '../repositories/yeu-cau-gia-han.repository';
import { TroGiaRepository } from '../repositories/yeu-cau-gia-han.repository';

export class ApprovalService {
  private repo = new YeuCauGiaHanRepository();

  async getAllRequests() {
    const requests = await this.repo.getAll();
    const troGiaRepo = new TroGiaRepository();
    const troGias = await troGiaRepo.getAll();
    // Lấy tất cả các trường hợp miễn phí gia hạn (chuỗi, có thể phân tách bằng dấu phẩy)
    const allCases = troGias.flatMap(tg => tg.truongHopMienPhiGiaHan.split(',').map(s => s.trim().toLowerCase()));
    // Cập nhật specialCase nếu reason nằm trong danh sách
    return requests.map(req => ({
      ...req,
      specialCase: allCases.includes(req.reason.trim().toLowerCase()) ? 'miễn phí' : 'có phí',
    }));
  }
  // Thêm các hàm duyệt, từ chối ...

  // Duyệt yêu cầu gia hạn
  async approveRequest(id: string, scheduleId: string) {
    // Cập nhật trạng thái sang "Đã phê duyệt"
    // Có thể cập nhật thêm lịch thi mới nếu cần (ở đây chỉ update trạng thái)
    return this.repo.updateStatusById(id, "Đã phê duyệt");
  }

  // Từ chối yêu cầu gia hạn
  async rejectRequest(id: string, rejectReason: string) {
    // Cập nhật trạng thái sang "Đã từ chối" và lưu lý do từ chối
    return this.repo.updateStatusById(id, "Đã từ chối", rejectReason);
  }
} 