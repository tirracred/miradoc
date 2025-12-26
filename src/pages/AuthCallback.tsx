import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Função para processar o código vindo do email
    const handleAuthCallback = async () => {
      // Pega o código da URL
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/app"; // Para onde ir depois? Padrão: /app

      if (code) {
        try {
          // Troca o código pela sessão do usuário
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) throw error;

          // Se deu certo, avisa e redireciona
          toast({
            title: "Email confirmado!",
            description: "Você foi autenticado com sucesso.",
            className: "bg-green-50 border-green-200"
          });
          
          navigate(next);
        } catch (error: any) {
          console.error("Erro na verificação:", error);
          toast({
            variant: "destructive",
            title: "Link inválido ou expirado",
            description: "Tente fazer login novamente para receber um novo link.",
          });
          navigate("/login");
        }
      } else {
        // Se não tem código, manda pro login
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-semibold text-gray-700">Validando seu acesso...</h2>
      <p className="text-muted-foreground text-sm">Aguarde um momento.</p>
    </div>
  );
};

export default AuthCallback;