import { ScheduleRepository } from "./../repositories/ScheduleRepository";
import { RegistrationInfoForm } from "@/features/registration/schemas";
import { DatabaseConnection } from "../database/connection"; // chỉnh lại path nếu khác
import ScheduleOption from "../models/ScheduleOption"; // nơi bạn định nghĩa interface
import sql from "mssql";
import { v4 as uuidv4 } from "uuid";
export class ScheduleService {
  private ScheduleRepository: ScheduleRepository;

  constructor() {
    this.ScheduleRepository = new ScheduleRepository();
  }

  public async getScheduleOptions(): Promise<ScheduleOption[]> {
    try {
      return this.ScheduleRepository.getScheduleOptions();
    } catch (error) {
      console.error("[SCHEDULE_SERVICE_ERROR]", error);
      throw new Error("Lỗi khi lấy danh sách lịch học");
    }
  }
  public async register(info: RegistrationInfoForm) {
    try {
      return await this.ScheduleRepository.register(info);
    } catch (error) {
      console.error("[SCHEDULE_SERVICE_ERROR]", error);
      throw new Error("Lỗi khi đăng ký lịch học");
    }
  }
}
