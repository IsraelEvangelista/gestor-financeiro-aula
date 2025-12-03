import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthLayout } from "@/layouts/AuthLayout";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nome: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Verificar se email foi confirmado
        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          throw new Error('Por favor, confirme seu email antes de fazer login.');
        }

        // Tentar verificar se usuário está ativo
        try {
          const { data: userData, error: userError } = await supabase
            .from('usuario')
            .select('ativo')
            .eq('id', data.user.id)
            .maybeSingle();

          // Se usuário não existe, criar automaticamente
          if (!userData && !userError) {
            await supabase.from('usuario').insert({
              id: data.user.id,
              nome: data.user.user_metadata?.nome || 'Usuário',
              ativo: true
            });
          } else if (userData && !userData.ativo) {
            await supabase.auth.signOut();
            throw new Error('Usuário inativo.');
          }
        } catch (profileError) {
          console.warn('Erro ao verificar perfil:', profileError);
        }

        navigate("/dashboard");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('Nome é obrigatório');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Validação de senha forte
      // Pelo menos 8 caracteres, uma maiúscula, um número e um caractere especial
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      
      if (!passwordRegex.test(formData.password)) {
        throw new Error(
          'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.'
        );
      }

      // Criar usuário no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        setSuccess(
          'Conta criada com sucesso! Verifique seu email para ativar sua conta.'
        );
        // Limpar formulário
        setFormData({ email: "", password: "", confirmPassword: "", nome: "" });
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-secondary/50 backdrop-blur-sm">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Cadastro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(0,255,136,0.05)]">
            <CardHeader>
              <CardTitle>Bem-vindo de volta</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar sua conta.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="seu@email.com" 
                    required 
                    className="bg-background/50" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                    >
                      Esqueci a senha
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      required 
                      className="bg-background/50 pr-10"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(0,255,136,0.05)]">
            <CardHeader>
              <CardTitle>Criar nova conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para começar.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-primary/20 bg-primary/10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-primary">{success}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input 
                    id="name" 
                    name="nome"
                    placeholder="João Silva" 
                    required 
                    className="bg-background/50" 
                    value={formData.nome}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email *</Label>
                  <Input 
                    id="register-email" 
                    name="email"
                    type="email" 
                    placeholder="seu@email.com" 
                    required 
                    className="bg-background/50" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha *</Label>
                  <div className="relative">
                    <Input 
                      id="register-password" 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      required 
                      className="bg-background/50 pr-10"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha *</Label>
                  <div className="relative">
                    <Input 
                      id="confirm-password" 
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      required 
                      className="bg-background/50 pr-10"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
