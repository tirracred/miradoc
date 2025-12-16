import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MiraLogo } from './MiraLogo';

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface SearchScreenProps {
  onSearch: (params: { name: string; state: string; crm: string }) => void;
  isLoading: boolean;
}

export function SearchScreen({ onSearch, isLoading }: SearchScreenProps) {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [crm, setCrm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (crm.trim() && state) {
      onSearch({ name: name.trim(), state, crm: crm.trim() });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Slogan */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <MiraLogo size="lg" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            Confiança antes da consulta.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
          <div className="bg-card rounded-2xl p-6 card-shadow space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="crm" className="text-sm font-medium text-foreground">
                  CRM *
                </label>
                <Input
                  id="crm"
                  type="text"
                  placeholder="123456"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium text-foreground">
                  Estado *
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">Selecione</option>
                  {BRAZILIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome (Opcional)
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Dr. João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="mira" 
            size="lg" 
            className="w-full"
            disabled={!crm.trim() || !state || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Investigando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search size={20} />
                INVESTIGAR
              </span>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Verificação de registro profissional médico
        </p>
      </div>
    </div>
  );
}
