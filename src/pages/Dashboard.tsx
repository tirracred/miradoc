import { useState } from 'react';
import { SearchScreen } from '@/components/SearchScreen';
import { DoctorList } from '@/components/DoctorList';
import { Report } from '@/components/Report';
import { Doctor, DoctorReport } from '@/types/doctor';
import { verifyDoctor, generateReport } from '@/services/doctorService';
import { useToast } from '@/hooks/use-toast';

type AppState = 'search' | 'list' | 'report';

const Index = () => {
  const [state, setState] = useState<AppState>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [report, setReport] = useState<DoctorReport | null>(null);
  const { toast } = useToast();

  const handleSearch = async (params: { name: string; state: string; crm: string }) => {
    // Validate that we have CRM and State for real API call
    if (!params.crm || !params.state) {
      toast({
        title: "Dados obrigatórios",
        description: "Para verificação no CFM, informe o CRM e o Estado.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const response = await verifyDoctor({
      name: params.name,
      state: params.state,
      crm: params.crm,
    });

    setIsLoading(false);

    if (!response.success) {
      if (response.requiresCRM) {
        toast({
          title: "CRM necessário",
          description: response.error || "Informe o CRM e Estado para verificação.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Médico não encontrado",
          description: response.error || "Não foi possível verificar este profissional.",
          variant: "destructive",
        });
      }
      return;
    }

    const results = response.doctors || [];
    setDoctors(results);

    if (results.length === 0) {
      toast({
        title: "Nenhum resultado",
        description: "Não encontramos médicos com os critérios informados.",
        variant: "destructive",
      });
    } else if (results.length === 1) {
      handleSelectDoctor(results[0]);
    } else {
      setState('list');
    }
  };

  const handleSelectDoctor = async (doctor: Doctor) => {
    setIsLoading(true);
    
    try {
      const generatedReport = await generateReport(doctor);
      setReport(generatedReport);
      setState('report');
      
      if (!generatedReport.isRegular) {
        toast({
          title: "Atenção",
          description: "Este profissional apresenta situação irregular no CFM.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verificação concluída",
          description: "Profissional com registro regular no CFM.",
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleBack = () => {
    setState('search');
    setDoctors([]);
    setReport(null);
  };

  const handleBackToList = () => {
    if (doctors.length > 1) {
      setState('list');
      setReport(null);
    } else {
      handleBack();
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {state === 'search' && (
        <SearchScreen onSearch={handleSearch} isLoading={isLoading} />
      )}
      
      {state === 'list' && (
        <DoctorList 
          doctors={doctors} 
          onSelect={handleSelectDoctor} 
          onBack={handleBack}
        />
      )}
      
      {state === 'report' && report && (
        <Report report={report} onBack={handleBackToList} />
      )}
    </main>
  );
};

export default Index;
