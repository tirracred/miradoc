// src/pages/Landing.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Search, Shield, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Simples */}
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <div className="font-bold text-2xl text-primary flex items-center gap-2">
          <Search className="w-6 h-6" /> Miradoc
        </div>
        <nav className="space-x-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>Entrar</Button>
          <Button onClick={() => navigate("/register")}>Cadastrar Médico</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Validação Médica e <br/> Inteligência de Dados
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Consulte CRMs, verifique antecedentes jurídicos e conecte-se com a maior rede exclusiva de médicos do Brasil.
          </p>
        </div>

        {/* Pricing / Bypass Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Opção 1: Consulta Avulsa */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle>Consulta Rápida</CardTitle>
              <CardDescription>Para pacientes e verificações pontuais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">R$ 9,90 <span className="text-sm font-normal text-muted-foreground">/consulta</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Status no CFM em tempo real</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Verificação de Processos Jurídicos</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Relatório em PDF</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Fazer Consulta Única</Button>
            </CardFooter>
          </Card>

          {/* Opção 2: Membro Miradoc (Futura Rede Social) */}
          <Card className="relative overflow-hidden border-primary shadow-lg bg-primary/5">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
              RECOMENDADO
            </div>
            <CardHeader>
              <CardTitle>Membro Miradoc</CardTitle>
              <CardDescription>Para médicos e profissionais de saúde</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">R$ 49,90 <span className="text-sm font-normal text-muted-foreground">/mês</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Consultas Ilimitadas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Acesso à Rede Social Exclusiva</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Vitrine Profissional (Rankeamento)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Badge de Verificado</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate("/login")}>Assinar e Entrar</Button>
            </CardFooter>
          </Card>

        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        © 2024 Miradoc. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Landing;