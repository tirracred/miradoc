import { Activity } from 'lucide-react';

interface MiraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function MiraLogo({ size = 'md', showText = true }: MiraLogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 40, text: 'text-4xl' },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Activity 
          size={sizes[size].icon} 
          className="text-primary animate-pulse-slow" 
          strokeWidth={2.5}
        />
        <div className="absolute inset-0 blur-sm opacity-50">
          <Activity 
            size={sizes[size].icon} 
            className="text-primary" 
            strokeWidth={2.5}
          />
        </div>
      </div>
      {showText && (
        <span className={`${sizes[size].text} font-bold tracking-tight text-foreground`}>
          MIRA
        </span>
      )}
    </div>
  );
}
