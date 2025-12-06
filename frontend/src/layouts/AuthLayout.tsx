import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <img 
            src="/logo_gestor_fin.png" 
            alt="Gestor Financeiro Logo" 
            className="h-16 w-auto drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]"
          />
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">
              Curso Vibe Coding
            </h1>
            <p className="text-green-500 font-bold text-lg tracking-wide">
              Gestor Financeiro
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {children}
        </div>
      </div>
    </div>
  );
}
