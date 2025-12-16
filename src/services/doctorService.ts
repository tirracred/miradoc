import { supabase } from '@/integrations/supabase/client';
import { Doctor, DoctorReport, LegalProcess, LocationInfo } from '@/types/doctor';

interface VerifyDoctorResponse {
  success: boolean;
  doctors?: Doctor[];
  error?: string;
  requiresCRM?: boolean;
}

export async function verifyDoctor(params: { 
  name?: string; 
  state?: string; 
  crm?: string 
}): Promise<VerifyDoctorResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-doctor', {
      body: {
        crm: params.crm,
        uf: params.state,
        name: params.name,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      return { success: false, error: error.message };
    }

    return data as VerifyDoctorResponse;
  } catch (err) {
    console.error('Error calling verify-doctor:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Erro ao conectar com o serviço' 
    };
  }
}

async function searchLegalProcesses(doctor: Doctor): Promise<LegalProcess[]> {
  try {
    const { data, error } = await supabase.functions.invoke('search-legal-processes', {
      body: {
        doctorName: doctor.name,
        crm: doctor.crm,
        state: doctor.state,
      },
    });

    if (error) {
      console.error('Error searching legal processes:', error);
      return [];
    }

    return data?.processes || [];
  } catch (err) {
    console.error('Error calling search-legal-processes:', err);
    return [];
  }
}

export async function generateReport(doctor: Doctor): Promise<DoctorReport> {
  // Search for legal processes using Google Custom Search
  const legalHistory = await searchLegalProcesses(doctor);
  
  const location: LocationInfo = {
    hospitals: [],
    clinics: [],
  };

  const isInactive = doctor.status === 'INATIVO';

  return {
    doctor,
    reportDate: new Date().toLocaleDateString('pt-BR'),
    protocol: `MIRA-${Date.now().toString(36).toUpperCase()}`,
    isRegular: !isInactive,
    legalHistory,
    location,
  };
}