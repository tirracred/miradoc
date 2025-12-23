import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ShieldCheck, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client"; // Importação do Supabase
import { useState } from "react"; // Estado para loading

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Estado para controlar o clique

  // Função REAL conectada ao Stripe
  const handleCheckout = async (planType: 'single' | 'subscription') => {
    try {
      setLoading(true);
      
      // 1. Verificar se o usuário está logado
      const { data: { session } } = await supabase.auth.getSession();
      
      // Se não estiver logado, manda para o Login (ou registro)
      if (!session) {
        toast({
          title: "Login necessário",
          description: "Crie sua conta ou faça login para continuar o pagamento.",
        });
        // Redireciona para o login passando o plano na URL para processar depois
        navigate(`/login?plan=${planType}`); 
        return;
      }

      // 2. Chamar a Edge Function do Supabase (que cria o link do Stripe)
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planType,
          userId: session.user.id,
          returnUrl: window.location.origin // Manda a URL atual para retorno após pagamento
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("Link de pagamento não gerado");

      // 3. Redirecionar o usuário para o Checkout do Stripe
      window.location.href = data.url;

    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar pagamento",
        description: error.message || "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header Institucional */}
      <header className="border-b border-gray-100 py-4 px-6 flex justify-between items-center bg-white sticky top-0 z-50">
        
        {/* Logo + Nome */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img 
            src="/favicon.ico" 
            alt="Miradoc Logo" 
            className="w-8 h-8 object-contain" 
          />
          <span className="text-2xl font-bold text-primary tracking-tight">
            Miradoc
          </span>
        </div>

        {/* Navegação Direita */}
        <nav className="flex items-center gap-4">
          <div className="hidden md:flex gap-4 mr-4">
            <Button variant="ghost" className="text-gray-600 hover:text-primary" onClick={() => navigate("/login")}>
              Área do Paciente
            </Button>
          </div>
          
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-white transition-colors gap-2"
            onClick={() => navigate("/login?type=doctor")}
          >
            <Stethoscope className="w-4 h-4" />
            Sou Médico
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Segurança e Credibilidade Médica
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Inteligência de Dados para <br/> 
            <span className="text-primary">Decisões de Saúde</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A plataforma mais completa para validação de CRMs, verificação de antecedentes e conexão entre pacientes e médicos qualificados.
          </p>
        </div>

        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Opção 1: Consulta Avulsa */}
          <Card className="relative overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-800 text-xl">Consulta Avulsa</CardTitle>
              <CardDescription>Ideal para verificações pontuais de um profissional.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-slate-900">
                R$ 9,90 
                <span className="text-sm font-normal text-slate-500 ml-2">/única</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-100"><Check className="w-3 h-3 text-green-700"/></div>
                  Validação de Status no CFM
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-100"><Check className="w-3 h-3 text-green-700"/></div>
                  Varredura de Processos Públicos
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-100"><Check className="w-3 h-3 text-green-700"/></div>
                  Relatório PDF para Download
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
                onClick={() => handleCheckout('single')}
                disabled={loading} // Desabilita se estiver carregando
              >
                {loading ? "Processando..." : "Consultar Agora"}
              </Button>
            </CardFooter>
          </Card>

          {/* Opção 2: Assinatura Mensal */}
          <Card className="relative overflow-hidden border-primary border-2 shadow-xl bg-white">
            <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-xs font-bold rounded-bl-lg uppercase tracking-wider">
              Mais Popular
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-primary text-xl">Assinatura Mensal</CardTitle>
              <CardDescription>Para pacientes recorrentes ou famílias.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CORRIGIDO PREÇO PARA 49,90 */}
              <div className="text-4xl font-bold text-primary">
                R$ 49,90 
                <span className="text-sm font-normal text-slate-500 ml-2">/mês</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary/10"><Check className="w-3 h-3 text-primary"/></div>
                  <strong>10 Consultas</strong> Detalhadas por mês
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary/10"><Check className="w-3 h-3 text-primary"/></div>
                  Histórico de Pesquisas Salvo
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary/10"><Check className="w-3 h-3 text-primary"/></div>
                  Acesso à Avaliação da Comunidade
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary/10"><Check className="w-3 h-3 text-primary"/></div>
                  Alertas de Alteração de Status
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20"
                onClick={() => handleCheckout('subscription')}
                disabled={loading} // Desabilita se estiver carregando
              >
                {loading ? "Processando..." : "Assinar Plano Mensal"}
              </Button>
            </CardFooter>
          </Card>

        </div>
      </main>

      <footer className="bg-slate-50 py-12 mt-20 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
            <img src="/favicon.ico" alt="Logo" className="w-5 h-5 grayscale" />
            <span className="font-semibold">Miradoc</span>
          </div>
          <p>© 2024 Miradoc Serviços de Informação em Saúde.</p>
          <p className="mt-2 text-xs">Todos os dados são provenientes de fontes públicas oficiais.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;