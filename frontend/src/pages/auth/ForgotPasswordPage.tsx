import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLayout } from "@/layouts/AuthLayout";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout>
      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(0,255,136,0.05)]">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <CardTitle>Recuperar Senha</CardTitle>
          </div>
          <CardDescription>
            {isSubmitted 
              ? "Verifique seu email para instruções de recuperação." 
              : "Digite seu email para receber um link de redefinição."}
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required className="bg-background/50" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Link"
                )}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-in zoom-in duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <p className="text-center text-muted-foreground">
              Enviamos um email para você com as instruções para redefinir sua senha.
            </p>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/auth">Voltar para Login</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </AuthLayout>
  );
}
