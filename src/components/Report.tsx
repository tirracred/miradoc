import { CheckCircle, XCircle, FileText, User, Scale, MapPin, ArrowLeft, GraduationCap, Calendar, Phone } from 'lucide-react';
import { DoctorReport } from '@/types/doctor';
import { MiraLogo } from './MiraLogo';
import { Button } from '@/components/ui/button';

interface ReportProps {
  report: DoctorReport;
  onBack: () => void;
}

export function Report({ report, onBack }: ReportProps) {
  const { doctor, reportDate, protocol, isRegular, legalHistory, location } = report;
  const hasLocation = location.hospitals.length > 0 || location.clinics.length > 0;
  const hasAddress = doctor.address && doctor.address.trim().length > 0;

  return (
    <div className="min-h-screen bg-secondary/50 p-4 md:p-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} />
          Nova consulta
        </Button>

        {/* Document */}
        <div className="bg-card rounded-2xl document-shadow overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <MiraLogo size="md" />
                <p className="text-xs text-muted-foreground mt-2">
                  Relatório de Verificação Profissional
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Data: <span className="text-foreground font-medium">{reportDate}</span></p>
                <p className="text-muted-foreground">Protocolo: <span className="text-foreground font-mono text-xs">{protocol}</span></p>
              </div>
            </div>
          </div>

          {/* Status Stamp */}
          <div className="relative p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isRegular ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  <User className={isRegular ? 'text-success' : 'text-destructive'} size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{doctor.name}</h1>
                  <p className="text-muted-foreground">CRM {doctor.crm}/{doctor.state}</p>
                </div>
              </div>
              
              {/* Stamp */}
              <div className={`absolute right-6 top-4 px-4 py-2 border-4 rounded-lg transform rotate-[-12deg] animate-stamp ${
                isRegular 
                  ? 'border-success text-success' 
                  : 'border-destructive text-destructive'
              }`}>
                <span className="font-bold text-lg tracking-wider">
                  {isRegular ? 'REGULAR' : 'IRREGULAR'}
                </span>
              </div>
            </div>
          </div>

          {/* Section A - Identity */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="text-primary" size={18} />
              </div>
              <h2 className="font-bold text-foreground">Seção A - Identidade Profissional</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Nome</p>
                <p className="font-medium text-foreground">{doctor.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">CRM</p>
                <p className="font-medium text-foreground">{doctor.crm}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Estado</p>
                <p className="font-medium text-foreground">{doctor.state}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Situação</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${
                  doctor.status === 'ATIVO' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {doctor.status === 'ATIVO' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {doctor.status}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            {(doctor.specialty || doctor.institution || doctor.registrationDate) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                {doctor.specialty && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Especialidade</p>
                    <p className="text-foreground">{doctor.specialty}</p>
                  </div>
                )}
                {doctor.institution && (
                  <div className="space-y-1 flex items-start gap-2">
                    <GraduationCap size={14} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Instituição</p>
                      <p className="text-foreground text-sm">{doctor.institution}</p>
                    </div>
                  </div>
                )}
                {doctor.registrationDate && (
                  <div className="space-y-1 flex items-start gap-2">
                    <Calendar size={14} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Data Inscrição</p>
                      <p className="text-foreground text-sm">{doctor.registrationDate}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {doctor.fullSituacao && doctor.fullSituacao !== doctor.status && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Situação detalhada:</span> {doctor.fullSituacao}
                </p>
              </div>
            )}
          </div>

          {/* Section B - Legal History */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Scale className="text-primary" size={18} />
              </div>
              <h2 className="font-bold text-foreground">Seção B - Histórico Jurídico</h2>
            </div>
            
            {legalHistory.length > 0 ? (
              <ul className="space-y-3">
                {legalHistory.map((process) => (
                  <li key={process.id} className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <a 
                      href={process.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      {process.title}
                    </a>
                    {process.snippet && (
                      <p className="text-sm text-muted-foreground mt-1">{process.snippet}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle size={18} />
                <p>Nenhum registro público detectado.</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3 italic">
              * Consulta realizada via Google Custom Search em fontes públicas.
            </p>
          </div>

          {/* Section C - Location */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="text-primary" size={18} />
              </div>
              <h2 className="font-bold text-foreground">Seção C - Localização</h2>
            </div>
            
            {hasAddress ? (
              <div className="space-y-2">
                <p className="text-foreground">
                  <span className="text-primary">•</span> Endereço registrado: <span className="font-medium">{doctor.address}</span>
                </p>
                {doctor.phone && (
                  <p className="text-foreground flex items-center gap-2">
                    <Phone size={14} className="text-muted-foreground" />
                    <span>{doctor.phone}</span>
                  </p>
                )}
              </div>
            ) : hasLocation ? (
              <div className="space-y-2">
                {location.hospitals.map((hospital, index) => (
                  <p key={`hospital-${index}`} className="text-foreground">
                    <span className="text-primary">•</span> Vínculo provável: <span className="font-medium">{hospital}</span>
                  </p>
                ))}
                {location.clinics.map((clinic, index) => (
                  <p key={`clinic-${index}`} className="text-foreground">
                    <span className="text-primary">•</span> Vínculo provável: <span className="font-medium">{clinic}</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Endereço não disponível no registro.</p>
            )}
          </div>

          {/* Footer */}
          <div className="bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Este relatório é gerado automaticamente pelo sistema MIRA com dados do CFM e tem caráter informativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
