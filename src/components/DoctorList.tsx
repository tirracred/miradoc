import { ChevronRight, User, MapPin, Stethoscope } from 'lucide-react';
import { Doctor } from '@/types/doctor';
import { MiraLogo } from './MiraLogo';
import { Button } from '@/components/ui/button';

interface DoctorListProps {
  doctors: Doctor[];
  onSelect: (doctor: Doctor) => void;
  onBack: () => void;
}

export function DoctorList({ doctors, onSelect, onBack }: DoctorListProps) {
  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <MiraLogo size="sm" />
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
            Nova busca
          </Button>
        </div>

        {/* Results Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            {doctors.length} resultado{doctors.length !== 1 ? 's' : ''} encontrado{doctors.length !== 1 ? 's' : ''}
          </h2>
          <p className="text-muted-foreground">
            Selecione o profissional para ver o relatório completo
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="space-y-3 animate-slide-up">
          {doctors.map((doctor, index) => (
            <button
              key={doctor.id}
              onClick={() => onSelect(doctor)}
              className="w-full bg-card rounded-xl p-4 card-shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-left group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <User className="text-primary" size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Stethoscope size={14} />
                        CRM {doctor.crm}/{doctor.state}
                      </span>
                      {doctor.specialty && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {doctor.specialty}
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      doctor.status === 'ATIVO' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {doctor.status}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={24} />
              </div>
            </button>
          ))}
        </div>

        {doctors.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <User className="text-muted-foreground" size={32} />
            </div>
            <p className="text-muted-foreground">
              Nenhum médico encontrado com os critérios informados.
            </p>
            <Button variant="outline" onClick={onBack}>
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
