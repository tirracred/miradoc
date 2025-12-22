import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // AQUI ENTRARÁ A LÓGICA DO SUPABASE DEPOIS
    // Por enquanto, vamos simular que logou e ir para o Dashboard
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button variant="ghost" className="w-fit pl-0 mb-2" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <CardTitle className="text-2xl text-center">Acesso Miradoc</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email ou CRM</label>
              <Input type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" required />
            </div>
            <Button type="submit" className="w-full">Entrar na Plataforma</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <a href="#" className="text-primary hover:underline">Esqueceu a senha?</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;