import { CertificateRepository } from "../repositories/certificate.repository"
import type { CertificateDetailsData } from "../models/certificate.model"

export class CertificateService {
  private repo = new CertificateRepository()

  async getCertificateDetails(maChungChi: string): Promise<CertificateDetailsData | null> {
    return await this.repo.findByCertificateCode(maChungChi)
  }
}
