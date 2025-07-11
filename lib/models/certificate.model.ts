

export type CertificateInfo = {
  maChungChi: string
  ngayThi: string
  soChungChi: string
  diemThi: string
  loaiChungChi: string
  ngayCap: string
  capDo: string
  coHieuLucDen: string
  trangThai: string
  donViCap: string
}

export type CandidateInfo = {
  hoVaTen: string
  ngaySinh: string
  dienThoai: string
  email: string
}

export type CertificateDetailsData = {
  certificate: CertificateInfo
  candidate: CandidateInfo
  notes: string
}
