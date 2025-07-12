// Model cho bảng YeuCauGiaHan
export interface YeuCauGiaHan {
  id: string ;
  ticketId: string ; 
  customerName: string ;
  customerType: string ;
  phone: string ;
  email: string ;
  examType: string ;
  currentDate: string ;
  requestedDate: string ;//+
  reason: string ;//+
  extensionCount: number;//+
  status: string;//+
  requestDate: string; //+
  documents: string;//-
  specialCase: string,//-
  lyDoTuChoi:string 
} 