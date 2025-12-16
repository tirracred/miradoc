import { Doctor, DoctorReport, LegalProcess, LocationInfo } from '@/types/doctor';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Carlos Eduardo Silva',
    crm: '123456',
    state: 'SP',
    status: 'ATIVO',
    specialty: 'Cardiologia',
  },
  {
    id: '2',
    name: 'Dra. Ana Maria Santos',
    crm: '789012',
    state: 'SP',
    status: 'ATIVO',
    specialty: 'Dermatologia',
  },
  {
    id: '3',
    name: 'Dr. Carlos Roberto Oliveira',
    crm: '345678',
    state: 'RJ',
    status: 'INATIVO',
    specialty: 'Ortopedia',
  },
  {
    id: '4',
    name: 'Dr. Fernando Henrique Costa',
    crm: '901234',
    state: 'MG',
    status: 'ATIVO',
    specialty: 'Neurologia',
  },
  {
    id: '5',
    name: 'Dra. Mariana Ferreira Lima',
    crm: '567890',
    state: 'SP',
    status: 'ATIVO',
    specialty: 'Pediatria',
  },
];

const mockLegalHistories: Record<string, LegalProcess[]> = {
  '1': [],
  '2': [],
  '3': [
    {
      id: 'proc-1',
      title: 'Processo TJRJ 0012345-67.2021.8.19.0001 - Indenização por danos morais',
      link: 'https://jusbrasil.com.br/processo/1',
      snippet: 'Processo de indenização por danos morais contra médico.',
    },
    {
      id: 'proc-2',
      title: 'Processo TJRJ 0098765-43.2020.8.19.0001 - Responsabilidade civil médica',
      link: 'https://jusbrasil.com.br/processo/2',
      snippet: 'Ação de responsabilidade civil médica.',
    },
  ],
  '4': [],
  '5': [
    {
      id: 'proc-3',
      title: 'Processo TJSP 1001234-56.2022.8.26.0100 - Erro médico (arquivado)',
      link: 'https://jusbrasil.com.br/processo/3',
      snippet: 'Processo por erro médico arquivado.',
    },
  ],
};

const mockLocations: Record<string, LocationInfo> = {
  '1': {
    hospitals: ['Hospital Sírio-Libanês', 'Hospital Albert Einstein'],
    clinics: ['Clínica Cardiológica Paulista'],
  },
  '2': {
    hospitals: [],
    clinics: ['DermaCare Centro Médico', 'Clínica Estética Jardins'],
  },
  '3': {
    hospitals: ['Hospital Copa Star'],
    clinics: [],
  },
  '4': {
    hospitals: ['Hospital Mater Dei', 'Hospital Felício Rocho'],
    clinics: [],
  },
  '5': {
    hospitals: ['Hospital Infantil Sabará'],
    clinics: ['Pediatria Integrada SP'],
  },
};

export function searchDoctors(params: { name?: string; state?: string; crm?: string }): Doctor[] {
  return mockDoctors.filter((doctor) => {
    const nameMatch = !params.name || doctor.name.toLowerCase().includes(params.name.toLowerCase());
    const stateMatch = !params.state || doctor.state === params.state;
    const crmMatch = !params.crm || doctor.crm.includes(params.crm);
    return nameMatch && stateMatch && crmMatch;
  });
}

export function generateReport(doctorId: string): DoctorReport | null {
  const doctor = mockDoctors.find((d) => d.id === doctorId);
  if (!doctor) return null;

  const legalHistory = mockLegalHistories[doctorId] || [];
  const location = mockLocations[doctorId] || { hospitals: [], clinics: [] };
  const hasLegalIssues = legalHistory.length > 0;
  const isInactive = doctor.status === 'INATIVO';

  return {
    doctor,
    reportDate: new Date().toLocaleDateString('pt-BR'),
    protocol: `MIRA-${Date.now().toString(36).toUpperCase()}`,
    isRegular: !hasLegalIssues && !isInactive,
    legalHistory,
    location,
  };
}
