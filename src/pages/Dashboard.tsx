import { useState, useEffect } from 'react';
import { SearchScreen } from '@/components/SearchScreen';
import { DoctorList } from '@/components/DoctorList';
import { Report } from '@/components/Report';
import { Doctor, DoctorReport } from '@/types/doctor';
import { verifyDoctor, generateReport } from '@/services/doctorService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

type AppState = 'search' | 'list' | 'report';

const Dashboard = () => {
  // Estados da Aplicação
  const [state, setState] = useState<AppState>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [report, setReport] = useState<DoctorReport | null>(null);
  
  // Novos Estados de Controle de Acesso (O Porteiro)
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Ao carregar a página, verifica se o usuário pode estar aqui
  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      // A. Verifica se tem sessão (Login)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Se não tá logado, chuta pro login
        navigate('/login');
        return;
      }

      // B. Verifica retorno do Stripe (Se acabou de pagar)
      const sessionId = searchParams.get('session_id');
      if (sessionId) {
        toast({
          title: "Pagamento Confirmado!",
          description: "Sua conta foi ativada. Bem-vindo ao Miradoc.",
          duration: 5000,
          className: "bg-green-50 border-green-200"
        });
        
        // Limpa a URL para ficar bonita (remove ?session_id=...)
        window.history.replaceState({}, document.title, "/app");
        
        // Libera o acesso imediatamente
        setHasAccess(true); 
      }

      // C. Busca o perfil no banco para ver se é assinante antigo ou tem créditos
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // REGRA DE OURO: Libera se for Assinante (active) OU tiver Créditos OU tiver acabado de chegar do Stripe
      if (profile && (profile.subscription_status === 'active' || profile.credits > 0 || sessionId)) {
        setHasAccess(true);
      } else {
        setHasAccess(false); // Bloqueia
      }

    } catch (error) {
      console.error("Erro ao verificar status:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível verificar sua assinatura.",
        variant: "destructive"
      });
    } finally {
      setCheckingAccess(false);
    }
  };

  const handleSearch = async (params: { name: string; state: string; crm: string }) => {
    // Bloqueio extra de segurança
    if (!hasAccess) {
      toast({
        title: "Acesso Bloqueado",
        description: "Você precisa de um plano ativo para realizar consultas.",
        variant: "destructive",
      });
      navigate('/'); 
      return;
    }

    if (!params.crm || !params.state) {
      toast({
        title: "Dados obrigatórios",
        description: "Para verificação no CFM, informe o CRM e o Estado.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // TODO: Aqui futuramente você pode descontar 1 crédito do banco se for plano avulso
    
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

  // --- RENDERIZAÇÃO ---

  // 1. Tela de Carregando (Enquanto verifica se pagou)
  if (checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Verificando acesso...</p>
      </div>
    );
  }

  // 2. Tela de Bloqueio (Se não pagou)
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-6 bg-background">
        <div className="bg-red-50 p-6 rounded-full ring-8 ring-red-50/50">
          <Lock className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Acesso Restrito</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Para acessar a base de dados médica e validar CRMs, você precisa de um plano ativo ou créditos de consulta.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            Voltar ao Início
          </Button>
          <Button onClick={() => navigate('/')} className="px-8">
            Ver Planos Disponíveis
          </Button>
        </div>
      </div>
    );
  }

  // 3. O App Real (Se pagou)
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

export default Dashboard;