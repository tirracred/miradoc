export interface Doctor {
  id: string;
  name: string;
  crm: string;
  state: string;
  status: 'ATIVO' | 'INATIVO';
  specialty?: string;
  address?: string;
  phone?: string;
  graduationYear?: string;
  institution?: string;
  registrationDate?: string;
  fullSituacao?: string;
}

export interface LegalProcess {
  id: string;
  title: string;
  link: string;
  snippet: string;
}

export interface LocationInfo {
  hospitals: string[];
  clinics: string[];
}

export interface DoctorReport {
  doctor: Doctor;
  reportDate: string;
  protocol: string;
  isRegular: boolean;
  legalHistory: LegalProcess[];
  location: LocationInfo;
}

export interface SearchParams {
  name: string;
  state: string;
  crm: string;
}
